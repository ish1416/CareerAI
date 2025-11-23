# 🔧 Coding Questions Troubleshooting Guide

## ✅ Problem Solved!

Your questions have been successfully seeded into the database!

## What Was Done

1. **Created seed script** (`seed-questions.js`)
2. **Seeded 6 questions** into the database
3. **Verified** questions are in the database

## Database Status

```
✅ 6 questions seeded
✅ 5 companies (Google, Amazon, Facebook, Microsoft, Apple)
✅ 5 topics (Arrays, Strings, Linked Lists, Trees, Dynamic Programming)
✅ All Easy difficulty (great for beginners)
✅ 4 languages per question (JavaScript, Python, Java, C++)
```

## How to Use

### 1. Start Your Backend (if not running)

```bash
cd CareerAI/backend
npm run dev
```

### 2. Start Your Frontend (if not running)

```bash
cd CareerAI/frontend
npm run dev
```

### 3. Visit the Page

Navigate to: `http://localhost:5174/coding-questions`

Questions should now load!

## If Questions Still Don't Load

### Check Backend is Running

```bash
# Should see: Server running on http://localhost:5001
curl http://localhost:5001/api/health
```

### Test API Directly

```bash
# Test questions endpoint
curl http://localhost:5001/api/coding-questions/questions

# Should return JSON with questions array
```

### Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any errors
4. Check Network tab for failed requests

### Common Issues

**Issue 1: "Failed to filter questions"**
- **Cause**: Backend not running or API endpoint not accessible
- **Fix**: Start backend with `npm run dev` in backend folder

**Issue 2: Empty questions array**
- **Cause**: Questions not seeded
- **Fix**: Run `node seed-questions.js` in backend folder

**Issue 3: CORS errors**
- **Cause**: Frontend and backend on different ports
- **Fix**: Check backend .env has correct FRONTEND_URL

**Issue 4: 401 Unauthorized**
- **Cause**: Not logged in
- **Fix**: Login first, then visit coding questions page

## Verify Database

### Option 1: Prisma Studio (Visual)

```bash
cd CareerAI/backend
npx prisma studio
```

Visit: `http://localhost:5555`
Navigate to: `CodingQuestion` table

### Option 2: Command Line

```bash
cd CareerAI/backend
node test-coding-api.js
```

Should show:
- Question count
- Sample questions
- Companies list
- Topics list

## Re-seed Questions (if needed)

If you need to re-seed:

```bash
cd CareerAI/backend

# Delete existing questions
npx prisma studio
# (Delete all from CodingQuestion table)

# Or use SQL
npx prisma db execute --stdin <<< "DELETE FROM \"CodingQuestion\";"

# Re-seed
node seed-questions.js
```

## Add More Questions

Edit `seed-questions.js` and add more questions to the array, then run:

```bash
node seed-questions.js
```

## API Endpoints

All working endpoints:

```
GET  /api/coding-questions/questions          - Get all questions
GET  /api/coding-questions/questions?company=Google  - Filter by company
GET  /api/coding-questions/questions?topic=Arrays    - Filter by topic
GET  /api/coding-questions/questions/:id      - Get specific question
POST /api/coding-questions/questions/:id/submit - Submit solution
GET  /api/coding-questions/progress           - Get user progress
GET  /api/coding-questions/companies          - Get companies list
GET  /api/coding-questions/topics             - Get topics list
GET  /api/coding-questions/stats              - Get user stats
```

## Test Each Endpoint

```bash
# Get questions
curl http://localhost:5001/api/coding-questions/questions

# Get companies
curl http://localhost:5001/api/coding-questions/companies

# Get topics
curl http://localhost:5001/api/coding-questions/topics

# Get progress (requires auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5001/api/coding-questions/progress
```

## Frontend Debugging

### Check API URL

In `frontend/.env`:
```
VITE_API_URL=http://localhost:5001/api
```

### Check Component

Open `CodingQuestions.jsx` and add console logs:

```javascript
const loadData = React.useCallback(async () => {
  try {
    console.log('Loading coding questions...');
    const response = await api.get('/coding-questions/questions');
    console.log('Response:', response.data);
    // ...
  } catch (err) {
    console.error('Error:', err);
    console.error('Error response:', err.response?.data);
  }
}, []);
```

## Success Checklist

- [ ] Backend running on port 5001
- [ ] Frontend running on port 5174
- [ ] 6 questions in database
- [ ] API endpoints responding
- [ ] User logged in
- [ ] Questions page loads
- [ ] Filters work
- [ ] Can click on questions
- [ ] Code editor opens

## Still Having Issues?

1. **Check backend logs** - Look for errors in terminal
2. **Check frontend console** - Look for errors in browser
3. **Verify database connection** - Check DATABASE_URL in .env
4. **Test API directly** - Use curl or Postman
5. **Check authentication** - Make sure you're logged in

## Quick Reset

If everything is broken, start fresh:

```bash
# 1. Stop all servers
# Press Ctrl+C in all terminals

# 2. Re-seed database
cd CareerAI/backend
node seed-questions.js

# 3. Start backend
npm run dev

# 4. Start frontend (new terminal)
cd CareerAI/frontend
npm run dev

# 5. Login and visit /coding-questions
```

## Files Created

- `seed-questions.js` - Seeds questions into database
- `test-coding-api.js` - Tests database and API
- `CODING_QUESTIONS_TROUBLESHOOTING.md` - This file

## Summary

✅ **Database**: 6 questions seeded
✅ **Backend**: API endpoints ready
✅ **Frontend**: Component ready
✅ **Sidebar**: Link added
✅ **Dashboard**: Stats added

**Everything is ready to use!** Just make sure both servers are running and you're logged in.

---

**Need more help?** Check the browser console and backend logs for specific error messages.
