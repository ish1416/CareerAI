# Database Migration Guide - Coding Questions Platform

## New Tables Added

This migration adds support for the Coding Questions Platform feature with three new tables:

1. **CodingQuestion** - Stores coding problems with solutions in multiple languages
2. **CodingSubmission** - Tracks user submissions and results
3. **CodingProgress** - Tracks user progress, streaks, and statistics

## Migration Steps

### 1. Update Prisma Schema

The schema has been updated in `prisma/schema.prisma` with the new models.

### 2. Run Migration

```bash
cd backend
npx prisma migrate dev --name add-coding-questions-platform
```

This will:
- Create the new tables in your database
- Generate updated Prisma Client
- Apply the migration

### 3. Seed Initial Questions

The service will automatically seed initial questions on first run. To manually seed:

```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const CodingQuestionsService = require('./src/services/codingQuestionsService.js').default;
const service = new CodingQuestionsService();
service.initializeQuestions().then(() => {
  console.log('Questions seeded successfully');
  process.exit(0);
});
"
```

### 4. Verify Migration

Check that tables were created:

```bash
npx prisma studio
```

Navigate to the new tables:
- CodingQuestion
- CodingSubmission
- CodingProgress

## Rollback (if needed)

If you need to rollback this migration:

```bash
npx prisma migrate resolve --rolled-back add-coding-questions-platform
```

## Features Enabled

After migration, users will have access to:

✅ Browse coding questions by company, topic, difficulty, platform
✅ Filter questions by multiple criteria
✅ View question details with examples and constraints
✅ Write and test solutions in JavaScript, Python, Java, C++
✅ Submit solutions and track progress
✅ View personal statistics and streaks
✅ Track solved questions by difficulty
✅ See company-specific progress
✅ Weekly activity tracking

## API Endpoints Available

- `GET /api/coding-questions/questions` - Get filtered questions
- `GET /api/coding-questions/questions/:id` - Get question details
- `POST /api/coding-questions/questions/:id/submit` - Submit solution
- `GET /api/coding-questions/progress` - Get user progress
- `GET /api/coding-questions/companies` - Get companies list
- `GET /api/coding-questions/topics` - Get topics list
- `GET /api/coding-questions/stats` - Get user statistics

## Frontend Route

Access the feature at: `/coding-questions`

## Notes

- Initial database includes 6 sample questions across different topics
- Questions are automatically generated for multiple companies and platforms
- Progress tracking includes streak calculation
- Submissions are stored with test results for review
- Language support: JavaScript, Python, Java, C++
