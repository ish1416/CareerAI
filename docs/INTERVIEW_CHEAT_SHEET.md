# 🎯 Interview Cheat Sheet - Quick Reference

## 📝 Project Summary (30 seconds)

"CareerAI is a full-stack career platform built with React and Node.js. It uses AI (Groq) to analyze resumes, match jobs, and provide career guidance. Features include resume building, ATS scoring, job matching, and 30+ career tools."

## 🏗️ Architecture

```
Frontend (React) → API (Express) → Database (PostgreSQL/Prisma)
                      ↓
                  Groq AI, Stripe, Google OAuth
```

## 🔑 Key Concepts

### Authentication
- JWT tokens (access + refresh)
- Access token: 15 min, in memory
- Refresh token: 7 days, HTTP-only cookie
- Middleware: `requireAuth` checks token

### Database
- Prisma ORM for type-safe queries
- Models: User, Resume, AnalysisReport, etc.
- Relations: User → Resumes (one-to-many)

### AI Integration
- Groq API for all AI features
- Centralized in `groqClient.js`
- Used for: analysis, rewriting, suggestions

## 💻 Code Snippets

### API Call (Frontend)
```javascript
import api from '../utils/api.js';
const data = await api.get('/endpoint');
const result = await api.post('/endpoint', { field: 'value' });
```

### Protected Route (Backend)
```javascript
router.get('/protected', requireAuth, async (req, res) => {
  const { userId } = req.user;
  // Your code
});
```

### Database Query
```javascript
const user = await prisma.user.findUnique({ where: { id } });
const resumes = await prisma.resume.findMany({ where: { userId } });
```

### AI Call
```javascript
import { groqChat } from '../utils/groqClient.js';
const response = await groqChat([
  { role: 'user', content: 'Analyze this resume...' }
]);
```

## ❓ Quick Answers

**Q: How does authentication work?**
A: JWT tokens. Login gets access + refresh tokens. Access token in headers, refresh in cookie. Middleware validates on protected routes.

**Q: How does resume analysis work?**
A: User uploads resume → parsed to text → sent to Groq AI with prompt → AI returns score/suggestions → saved to database → displayed to user.

**Q: How is code organized?**
A: Routes by feature (core, ai, career, tools), controllers for logic, services for external APIs, middleware for cross-cutting concerns.

**Q: How to add a feature?**
A: 1) Database model (if needed), 2) Backend route + controller, 3) Frontend component + route, 4) Test.

## 🚀 Common Tasks

**Add API endpoint:**
```javascript
// routes/core/new.js
router.post('/new', requireAuth, handler);

// index.js
import newRoutes from './routes/core/new.js';
app.use('/api/new', newRoutes);
```

**Add frontend page:**
```javascript
// pages/NewPage.jsx
export default function NewPage() {
  const [data, setData] = useState(null);
  useEffect(() => { fetchData(); }, []);
  return <div>{/* UI */}</div>;
}

// App.jsx
<Route path="/new" element={<RequireAuth><NewPage /></RequireAuth>} />
```

## 📚 File Locations

- Auth: `backend/src/routes/core/auth.js`, `frontend/src/context/AuthContext.jsx`
- Resume: `backend/src/routes/core/resume.js`, `frontend/src/pages/ResumeBuilder.jsx`
- AI: `backend/src/utils/groqClient.js`
- Database: `backend/prisma/schema.prisma`

## 🎯 Interview Tips

1. **Be honest** - Mention AI help but show learning
2. **Think aloud** - Explain your process
3. **Start simple** - Basic implementation first
4. **Ask questions** - Clarify requirements
5. **Show enthusiasm** - Be passionate!

---

**You got this! 🚀**

