# ⚡ Quick Implementation Guide

## 🎯 How to Implement Features On-The-Spot

### Template: Adding a Simple Feature

#### 1. Backend API Endpoint (5 minutes)

```javascript
// Step 1: Create route file
// backend/src/routes/core/example.js
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET endpoint
router.get('/example', requireAuth, async (req, res) => {
  try {
    const { userId } = req.user;
    const data = await prisma.user.findUnique({
      where: { id: userId },
      include: { resumes: true }
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST endpoint
router.post('/example', requireAuth, async (req, res) => {
  try {
    const { userId } = req.user;
    const { field1, field2 } = req.body;
    
    const result = await prisma.someModel.create({
      data: {
        userId,
        field1,
        field2
      }
    });
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

```javascript
// Step 2: Add to backend/src/index.js
import exampleRoutes from './routes/core/example.js';
app.use('/api/example', exampleRoutes);
```

#### 2. Frontend Component (5 minutes)

```javascript
// frontend/src/pages/ExamplePage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';

export default function ExamplePage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await api.get('/example/example');
      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const result = await api.post('/example/example', formData);
      setData(result.data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <h1>Example Feature</h1>
      {/* Your UI here */}
    </div>
  );
}
```

```javascript
// Step 3: Add route in frontend/src/App.jsx
import ExamplePage from './pages/ExamplePage.jsx';

<Route path="/example" element={
  <RequireAuth><AuthShell><ExamplePage /></AuthShell></RequireAuth>
} />
```

### Common Patterns

#### Pattern 1: CRUD Operations

```javascript
// Create
router.post('/items', requireAuth, async (req, res) => {
  const item = await prisma.item.create({ data: req.body });
  res.json(item);
});

// Read
router.get('/items', requireAuth, async (req, res) => {
  const items = await prisma.item.findMany({ where: { userId: req.user.userId } });
  res.json(items);
});

// Update
router.put('/items/:id', requireAuth, async (req, res) => {
  const item = await prisma.item.update({
    where: { id: parseInt(req.params.id) },
    data: req.body
  });
  res.json(item);
});

// Delete
router.delete('/items/:id', requireAuth, async (req, res) => {
  await prisma.item.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ success: true });
});
```

#### Pattern 2: AI Integration

```javascript
import { groqClient } from '../utils/groqClient.js';

router.post('/ai-feature', requireAuth, async (req, res) => {
  const { input } = req.body;
  
  const prompt = `You are a helpful assistant. ${input}`;
  
  const response = await groqClient.chat.completions.create({
    model: 'llama-3.1-70b',
    messages: [{ role: 'user', content: prompt }]
  });
  
  const result = response.choices[0].message.content;
  res.json({ result });
});
```

#### Pattern 3: File Upload

```javascript
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

router.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
  const file = req.file;
  // Process file
  res.json({ success: true, filename: file.filename });
});
```

### Quick Database Operations

```javascript
// Find one
const user = await prisma.user.findUnique({ where: { id: userId } });

// Find many with filter
const resumes = await prisma.resume.findMany({
  where: { userId },
  orderBy: { createdAt: 'desc' }
});

// Create
const resume = await prisma.resume.create({
  data: { userId, title, content }
});

// Update
const updated = await prisma.resume.update({
  where: { id },
  data: { title: 'New Title' }
});

// Delete
await prisma.resume.delete({ where: { id } });

// Include relations
const user = await prisma.user.findUnique({
  where: { id },
  include: { resumes: true, coverLetters: true }
});
```

### Common React Patterns

```javascript
// Form handling
const [formData, setFormData] = useState({ name: '', email: '' });

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  await api.post('/endpoint', formData);
};

// Loading states
const [loading, setLoading] = useState(false);
const [data, setData] = useState(null);
const [error, setError] = useState(null);

// Conditional rendering
{loading && <div>Loading...</div>}
{error && <div>Error: {error}</div>}
{data && <div>{/* Display data */}</div>}
```

---

## 🎯 Interview Scenarios

### Scenario 1: "Add a feature to save favorite jobs"

**Your approach:**
1. "I'll need to add a database model for favorites"
2. "Create API endpoints to add/remove favorites"
3. "Add UI button to favorite/unfavorite"
4. "Show favorites list in user profile"

**Implementation:**
```javascript
// 1. Database (Prisma schema)
model FavoriteJob {
  id     Int @id @default(autoincrement())
  userId Int
  jobId  String
  user   User @relation(fields: [userId], references: [id])
}

// 2. API
router.post('/jobs/:jobId/favorite', requireAuth, async (req, res) => {
  const favorite = await prisma.favoriteJob.create({
    data: { userId: req.user.userId, jobId: req.params.jobId }
  });
  res.json(favorite);
});

// 3. Frontend
const handleFavorite = async (jobId) => {
  await api.post(`/jobs/${jobId}/favorite`);
  // Update UI
};
```

### Scenario 2: "Add search functionality"

**Your approach:**
1. "I'll add a search input component"
2. "Create API endpoint with query parameter"
3. "Filter results on backend"
4. "Display results with pagination"

**Implementation:**
```javascript
// Backend
router.get('/search', async (req, res) => {
  const { q } = req.query;
  const results = await prisma.resume.findMany({
    where: {
      OR: [
        { title: { contains: q } },
        { content: { string_contains: q } }
      ]
    }
  });
  res.json(results);
});

// Frontend
const [query, setQuery] = useState('');
const [results, setResults] = useState([]);

const handleSearch = async () => {
  const data = await api.get(`/search?q=${query}`);
  setResults(data);
};
```

---

## 💡 Pro Tips

1. **Start with the database** - Define your data model first
2. **Use existing patterns** - Copy from similar features
3. **Test as you go** - Use Postman/curl to test APIs
4. **Handle errors** - Always wrap in try-catch
5. **Think out loud** - Explain your thought process
6. **Ask for clarification** - Don't assume requirements
7. **Keep it simple** - Start basic, add complexity later

---

**Remember:** You know this codebase. Use existing patterns, and you'll be fine! 🚀

