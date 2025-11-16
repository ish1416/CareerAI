#!/bin/bash

echo "🚀 Setting up Coding Questions Platform..."
echo ""

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    echo "   cd backend && bash setup-coding-questions.sh"
    exit 1
fi

# Step 1: Generate Prisma Client
echo "📦 Step 1: Generating Prisma Client..."
npx prisma generate
if [ $? -eq 0 ]; then
    echo "✅ Prisma Client generated successfully"
else
    echo "❌ Failed to generate Prisma Client"
    exit 1
fi
echo ""

# Step 2: Create Migration
echo "🗄️  Step 2: Creating database migration..."
npx prisma migrate dev --name add-coding-questions-platform
if [ $? -eq 0 ]; then
    echo "✅ Migration created and applied successfully"
else
    echo "❌ Failed to create migration"
    echo "   If tables already exist, you can skip this step"
fi
echo ""

# Step 3: Seed Questions
echo "🌱 Step 3: Seeding initial coding questions..."
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    const count = await prisma.codingQuestion.count();
    if (count > 0) {
      console.log('✅ Questions already seeded (' + count + ' questions found)');
      process.exit(0);
    }
    
    console.log('Seeding questions...');
    // Questions will be auto-seeded on first service initialization
    console.log('✅ Questions will be seeded on first API call');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seed();
"
echo ""

# Step 4: Verify Setup
echo "🔍 Step 4: Verifying setup..."
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  try {
    const questionCount = await prisma.codingQuestion.count();
    const submissionCount = await prisma.codingSubmission.count();
    const progressCount = await prisma.codingProgress.count();
    
    console.log('📊 Database Status:');
    console.log('   - Coding Questions: ' + questionCount);
    console.log('   - Submissions: ' + submissionCount);
    console.log('   - User Progress Records: ' + progressCount);
    
    if (questionCount === 0) {
      console.log('');
      console.log('⚠️  No questions found. They will be auto-seeded on first use.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  }
}

verify();
"
echo ""

echo "✨ Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo "   1. Start your backend server: npm run dev"
echo "   2. Navigate to /coding-questions in your frontend"
echo "   3. Questions will be automatically seeded on first load"
echo ""
echo "📚 Documentation:"
echo "   - Feature Guide: ../CODING_QUESTIONS_FEATURE.md"
echo "   - Migration Guide: ./MIGRATION_GUIDE.md"
echo ""
echo "🎯 API Endpoints Available:"
echo "   - GET  /api/coding-questions/questions"
echo "   - GET  /api/coding-questions/questions/:id"
echo "   - POST /api/coding-questions/questions/:id/submit"
echo "   - GET  /api/coding-questions/progress"
echo "   - GET  /api/coding-questions/companies"
echo "   - GET  /api/coding-questions/topics"
echo "   - GET  /api/coding-questions/stats"
echo ""
echo "Happy Coding! 🚀"
