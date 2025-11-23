# 🎯 Coding Questions Platform - Complete Feature Guide

## Overview

The Coding Questions Platform is a comprehensive interview preparation tool integrated into CareerAI. It helps users practice coding problems from top tech companies, track their progress, and prepare for technical interviews.

## Features

### 🔍 Question Browsing & Filtering

**Multi-dimensional Filtering:**
- **By Company**: Google, Microsoft, Amazon, Facebook, Apple, Netflix, Uber, Airbnb, LinkedIn, Twitter
- **By Topic**: Arrays, Strings, Linked Lists, Trees, Graphs, Dynamic Programming, Sorting, Searching, Hash Tables, Stack, Queue, Heap, Trie, Backtracking
- **By Difficulty**: Easy, Medium, Hard
- **By Platform**: LeetCode, HackerRank, CodeSignal, InterviewBit
- **By Language**: JavaScript, Python, Java, C++

**Question Details:**
- Clear problem description
- Multiple examples with explanations
- Constraints and edge cases
- Hints for solving
- Acceptance rate and frequency
- Company tags

### 💻 Code Editor

**Multi-language Support:**
- JavaScript
- Python
- Java
- C++

**Features:**
- Syntax highlighting
- Code templates for each language
- Run code with test cases
- Submit solutions
- View test results

### 📊 Progress Tracking

**Personal Statistics:**
- Total problems solved
- Problems by difficulty (Easy/Medium/Hard)
- Current streak (consecutive days)
- Recent submissions
- Acceptance rate
- Average solving time

**Visual Analytics:**
- Weekly activity chart
- Company-specific progress
- Topic mastery levels
- Difficulty distribution

### 🏆 Gamification

**Achievements:**
- Streak tracking
- Milestone badges
- Topic mastery
- Company completion

## Database Schema

### CodingQuestion Table

```prisma
model CodingQuestion {
  id          Int      @id @default(autoincrement())
  title       String
  slug        String   @unique
  description String   @db.Text
  difficulty  String   // Easy, Medium, Hard
  topic       String
  company     String
  platform    String
  examples    Json     // Array of {input, output, explanation}
  constraints Json     // Array of constraint strings
  hints       Json     // Array of hint strings
  solution    Json     // {python, javascript, java, cpp}
  tags        Json     // Array of tags
  frequency   Int      // How often asked (0-100)
  acceptance  Int      // Acceptance rate (0-100)
  createdAt   DateTime
  updatedAt   DateTime
}
```

### CodingSubmission Table

```prisma
model CodingSubmission {
  id          Int      @id @default(autoincrement())
  userId      Int
  questionId  Int
  code        String   @db.Text
  language    String
  status      String   // Accepted, Wrong Answer, etc.
  runtime     String?
  memory      String?
  testResults Json?
  submittedAt DateTime
}
```

### CodingProgress Table

```prisma
model CodingProgress {
  id              Int       @id @default(autoincrement())
  userId          Int       @unique
  totalSolved     Int       @default(0)
  easySolved      Int       @default(0)
  mediumSolved    Int       @default(0)
  hardSolved      Int       @default(0)
  streak          Int       @default(0)
  lastSolvedDate  DateTime?
  solvedQuestions Json      // Array of solved question IDs
  favoriteTopics  Json      // Array of favorite topics
  createdAt       DateTime
  updatedAt       DateTime
}
```

## API Endpoints

### Get Questions (with filters)

```http
GET /api/coding-questions/questions?company=Google&difficulty=Easy&topic=Arrays&page=1&limit=20
```

**Response:**
```json
{
  "questions": [...],
  "total": 150,
  "page": 1,
  "totalPages": 8
}
```

### Get Question by ID

```http
GET /api/coding-questions/questions/:id
```

**Response:**
```json
{
  "question": {
    "id": 1,
    "title": "Two Sum",
    "description": "...",
    "difficulty": "Easy",
    "examples": [...],
    "solution": {
      "python": "...",
      "javascript": "...",
      "java": "...",
      "cpp": "..."
    }
  }
}
```

### Submit Solution

```http
POST /api/coding-questions/questions/:id/submit
```

**Request Body:**
```json
{
  "code": "function twoSum(nums, target) { ... }",
  "language": "javascript",
  "testResults": {
    "passed": true,
    "runtime": "52ms",
    "memory": "42MB"
  }
}
```

**Response:**
```json
{
  "submission": {
    "id": 123,
    "status": "Accepted",
    "runtime": "52ms",
    "memory": "42MB"
  }
}
```

### Get User Progress

```http
GET /api/coding-questions/progress
```

**Response:**
```json
{
  "totalSolved": 45,
  "easySolved": 20,
  "mediumSolved": 18,
  "hardSolved": 7,
  "streak": 5,
  "recentSubmissions": [...]
}
```

### Get Companies List

```http
GET /api/coding-questions/companies
```

**Response:**
```json
{
  "companies": [
    {
      "name": "Google",
      "questionCount": 150,
      "logo": "/logos/google.png"
    }
  ]
}
```

### Get Topics List

```http
GET /api/coding-questions/topics
```

**Response:**
```json
{
  "topics": [
    {
      "name": "Arrays",
      "questionCount": 85,
      "difficulty": {
        "easy": 30,
        "medium": 40,
        "hard": 15
      }
    }
  ]
}
```

### Get User Statistics

```http
GET /api/coding-questions/stats
```

**Response:**
```json
{
  "totalQuestions": 500,
  "solvedQuestions": 45,
  "accuracy": 78,
  "averageTime": 45,
  "favoriteTopics": ["Arrays", "Dynamic Programming"],
  "weeklyProgress": [...],
  "companyProgress": [...]
}
```

## Frontend Component

### Usage

```jsx
import CodingQuestions from './components/CodingQuestions';

// In your route
<Route path="/coding-questions" element={
  <RequireAuth>
    <AuthShell>
      <CodingQuestions />
    </AuthShell>
  </RequireAuth>
} />
```

### Component Features

**Question List View:**
- Grid layout of question cards
- Difficulty badges with color coding
- Company and topic tags
- Acceptance rate and frequency
- Click to open detailed view

**Question Detail Modal:**
- Split view: Problem description | Code editor
- Language selector
- Run code button
- Submit solution button
- Test results display
- Examples and constraints

**Progress Dashboard:**
- Statistics cards (total solved, streak, by difficulty)
- Filter panel
- Recent submissions

## Sample Questions Included

1. **Two Sum** (Easy - Arrays)
   - Companies: Google, Amazon, Microsoft, etc.
   - Topics: Arrays, Hash Table

2. **Best Time to Buy and Sell Stock** (Easy - Arrays)
   - Companies: Amazon, Facebook, Apple
   - Topics: Arrays, Dynamic Programming

3. **Valid Palindrome** (Easy - Strings)
   - Companies: Facebook, Microsoft
   - Topics: String, Two Pointers

4. **Reverse Linked List** (Easy - Linked Lists)
   - Companies: Microsoft, Amazon
   - Topics: Linked List, Recursion

5. **Maximum Depth of Binary Tree** (Easy - Trees)
   - Companies: Apple, Google
   - Topics: Tree, DFS, Recursion

6. **Climbing Stairs** (Easy - Dynamic Programming)
   - Companies: Google, Amazon
   - Topics: Dynamic Programming, Math

## How to Extend

### Adding New Questions

```javascript
// In codingQuestionsService.js
const newQuestion = {
  title: 'Your Question Title',
  slug: 'your-question-slug',
  description: 'Problem description...',
  difficulty: 'Medium',
  topic: 'Arrays',
  company: 'Google',
  platform: 'LeetCode',
  examples: [
    { input: '...', output: '...', explanation: '...' }
  ],
  constraints: ['...'],
  hints: ['...'],
  solution: {
    python: '...',
    javascript: '...',
    java: '...',
    cpp: '...'
  },
  tags: ['array', 'google'],
  frequency: 85,
  acceptance: 45
};

await prisma.codingQuestion.create({ data: newQuestion });
```

### Adding New Languages

1. Update the solution JSON structure
2. Add language option in frontend selector
3. Update code template generation

### Adding New Companies

Simply add questions with the new company name. The system automatically aggregates companies from questions.

## Career Benefits

### For Job Seekers

✅ **Interview Preparation**
- Practice questions from target companies
- Build confidence before interviews
- Identify weak areas

✅ **Skill Development**
- Master data structures and algorithms
- Learn multiple programming languages
- Improve problem-solving skills

✅ **Progress Tracking**
- Monitor improvement over time
- Set and achieve goals
- Maintain learning streaks

### For Career Growth

✅ **Company-Specific Prep**
- Focus on questions from target companies
- Understand company interview patterns
- Increase success rates

✅ **Topic Mastery**
- Identify favorite topics
- Focus on weak areas
- Build comprehensive knowledge

✅ **Competitive Edge**
- Stand out in technical interviews
- Demonstrate problem-solving ability
- Show continuous learning

## Best Practices

### For Users

1. **Start with Easy Problems**
   - Build confidence
   - Learn patterns
   - Progress gradually

2. **Focus on Understanding**
   - Don't just memorize solutions
   - Understand the approach
   - Learn time/space complexity

3. **Practice Regularly**
   - Maintain your streak
   - Consistent practice is key
   - Review previous solutions

4. **Company-Specific Prep**
   - Filter by target company
   - Focus on frequently asked questions
   - Understand company patterns

### For Developers

1. **Keep Questions Updated**
   - Add new questions regularly
   - Update frequency based on trends
   - Remove outdated questions

2. **Maintain Solution Quality**
   - Ensure solutions are optimal
   - Add detailed explanations
   - Include multiple approaches

3. **Monitor User Engagement**
   - Track popular questions
   - Identify difficult questions
   - Adjust difficulty ratings

## Future Enhancements

### Planned Features

- [ ] Video explanations for solutions
- [ ] Discussion forum for each question
- [ ] Peer code review
- [ ] Mock interview mode
- [ ] Timed challenges
- [ ] Leaderboards
- [ ] Custom question sets
- [ ] AI-powered hints
- [ ] Solution comparison
- [ ] Performance analytics

### Integration Opportunities

- [ ] LinkedIn profile integration
- [ ] GitHub repository sync
- [ ] Calendar reminders
- [ ] Email progress reports
- [ ] Mobile app
- [ ] Browser extension

## Troubleshooting

### Questions Not Loading

```bash
# Check if questions are seeded
npx prisma studio
# Navigate to CodingQuestion table

# Re-seed if needed
cd backend
node -e "require('./src/services/codingQuestionsService.js').default.initializeQuestions()"
```

### Progress Not Updating

```bash
# Check CodingProgress table
npx prisma studio

# Verify submissions are being created
# Check CodingSubmission table
```

### Language Solutions Missing

- Ensure all questions have solutions for all supported languages
- Update question data with missing language solutions

## Support

For issues or questions:
- GitHub Issues: [CareerAI Issues](https://github.com/ish1416/CareerAI/issues)
- Documentation: Check README.md
- Community: GitHub Discussions

---

**Feature Status**: ✅ Complete and Production Ready
**Last Updated**: November 16, 2025
**Version**: 1.0
