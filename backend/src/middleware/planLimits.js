import dayjs from 'dayjs';

// In-memory usage store. Replace with persistent storage for production.
const usageStore = new Map(); // userId => { date: 'YYYY-MM-DD', counts: { analyze: 0, rewrite: 0 } }

const LIMITS = {
  free: { analyze: 3, rewrite: 10 },
  pro: { analyze: 50, rewrite: 200 },
  enterprise: { analyze: 200, rewrite: 1000 },
};

function getPlan(req) {
  const envDefault = process.env.DEFAULT_PLAN || 'free';
  // Prefer explicit plan if present on user, then role fallback, else env default
  return (req.user && (req.user.plan || req.user.role)) || envDefault;
}

export function enforcePlanLimits(action) {
  return (req, res, next) => {
    const userId = req.user?.id || req.user?._id || 'anonymous';
    const plan = getPlan(req).toLowerCase();
    const today = dayjs().format('YYYY-MM-DD');
    const limits = LIMITS[plan] || LIMITS.free;

    // Initialize or roll date
    const rec = usageStore.get(userId) || { date: today, counts: { analyze: 0, rewrite: 0 } };
    if (rec.date !== today) {
      rec.date = today;
      rec.counts = { analyze: 0, rewrite: 0 };
    }

    const used = rec.counts[action] || 0;
    const cap = limits[action] || 0;

    // Expose headers for frontend UX
    res.setHeader('X-Plan', plan);
    res.setHeader('X-Limit-Action', action);
    res.setHeader('X-Limit-Cap', String(cap));
    res.setHeader('X-Limit-Used', String(used));

    if (cap > 0 && used >= cap) {
      return res.status(429).json({
        error: 'Plan limit reached',
        plan,
        action,
        limit: cap,
        used,
        message: 'Upgrade your plan to continue or wait until tomorrow.'
      });
    }

    // Increment after handler executes successfully
    // Wrap next to bump count only on success
    let finished = false;
    const end = res.end;
    res.end = function (...args) {
      if (!finished) {
        try {
          const status = res.statusCode;
          if (status >= 200 && status < 400) {
            rec.counts[action] = (rec.counts[action] || 0) + 1;
            usageStore.set(userId, rec);
          }
        } catch (_) { /* noop */ }
        finished = true;
      }
      return end.apply(this, args);
    };

    next();
  };
}