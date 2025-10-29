// Basic resume text to structured sections mapper
// This preserves simple bullet/line boundaries and detects common headings.

function splitLines(text) {
  return (text || '')
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function detectHeader(lines) {
  const header = { name: '', email: '', phone: '', linkedin: '', github: '', location: '' };
  const emailRe = /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/;
  const phoneRe = /(?:(?:\+?\d[\d\s\-().]{7,}\d))/;
  const linkedinRe = /linkedin\.com\/[A-Za-z0-9\-_/]+/i;
  const githubRe = /github\.com\/[A-Za-z0-9\-_/]+/i;

  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const l = lines[i];
    if (!header.email) header.email = (l.match(emailRe) || [])[0] || '';
    if (!header.phone) header.phone = (l.match(phoneRe) || [])[0] || '';
    if (!header.linkedin) header.linkedin = (l.match(linkedinRe) || [])[0] || '';
    if (!header.github) header.github = (l.match(githubRe) || [])[0] || '';
    if (!header.name && /[A-Za-z]{2,}\s+[A-Za-z]{2,}/.test(l) && !emailRe.test(l)) {
      header.name = l.replace(/\s{2,}/g, ' ');
    }
  }
  return header;
}

function normalizeHeading(str) {
  const s = (str || '').toLowerCase();
  if (/^education\b/.test(s)) return 'education';
  if (/^experience\b|work\s+history|employment\b/.test(s)) return 'experience';
  if (/^skills?\b|technical\s+skills?\b/.test(s)) return 'skills';
  if (/^projects?\b/.test(s)) return 'projects';
  if (/^certifications?\b/.test(s)) return 'certifications';
  if (/^achievements?\b|awards?\b/.test(s)) return 'achievements';
  if (/^summary\b|profile\b|objective\b/.test(s)) return 'summary';
  return '';
}

function groupSections(lines) {
  const sections = {};
  let current = '';
  for (const line of lines) {
    const head = normalizeHeading(line);
    if (head) {
      current = head;
      if (!sections[current]) sections[current] = [];
      continue;
    }
    if (!current) {
      // Infer experience block by dates or company tokens before first explicit section
      const looksLikeExp = /(20\d{2}|19\d{2})/.test(line) || /(Inc\.?|LLC|Ltd\.?|Company|Corp\.?)/i.test(line);
      if (looksLikeExp) {
        current = 'experience';
        if (!sections[current]) sections[current] = [];
      }
    }
    if (current) sections[current].push(line);
  }
  return sections;
}

function postProcess(sections) {
  const result = {
    personal: {},
    summary: '',
    education: '',
    experience: '',
    skills: '',
    achievements: '',
    projects: '',
    certifications: '',
  };

  // Join lines with newlines to preserve bullets and ordering
  for (const key of Object.keys(result)) {
    if (key === 'personal') continue;
    if (Array.isArray(sections[key])) {
      result[key] = sections[key].join('\n');
    }
  }

  // Derive skills from a colon line if missing
  if (!result.skills) {
    const skillsLine = (sections.skills || []).find((l) => /^skills?:/i.test(l));
    if (skillsLine) result.skills = skillsLine.replace(/^skills?:\s*/i, '');
  }

  // Fallback: if experience is empty, pick date/company-like lines
  if (!result.experience) {
    const expCandidates = Object.values(sections).flat().filter((l) => /(20\d{2}|19\d{2})/.test(l) || /(Inc\.?|LLC|Ltd\.?|Company|Corp\.?)/i.test(l));
    result.experience = expCandidates.slice(0, 40).join('\n');
  }

  return result;
}

export function mapResumeText(text) {
  const lines = splitLines(text);
  const header = detectHeader(lines);
  const grouped = groupSections(lines);
  const mapped = postProcess(grouped);
  mapped.personal = header;
  return mapped;
}