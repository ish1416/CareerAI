import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  console.log('🧪 Testing Coding Questions API...\n');

  try {
    // Test 1: Count questions
    const count = await prisma.codingQuestion.count();
    console.log(`✅ Test 1: Question Count`);
    console.log(`   Found ${count} questions in database\n`);

    // Test 2: Get all questions
    const questions = await prisma.codingQuestion.findMany({
      take: 3
    });
    console.log(`✅ Test 2: Fetch Questions`);
    console.log(`   Sample questions:`);
    questions.forEach(q => {
      console.log(`   - ${q.title} (${q.difficulty}, ${q.company})`);
    });
    console.log('');

    // Test 3: Get companies
    const companies = await prisma.codingQuestion.groupBy({
      by: ['company'],
      _count: { company: true }
    });
    console.log(`✅ Test 3: Companies`);
    companies.forEach(c => {
      console.log(`   - ${c.company}: ${c._count.company} questions`);
    });
    console.log('');

    // Test 4: Get topics
    const topics = await prisma.codingQuestion.groupBy({
      by: ['topic'],
      _count: { topic: true }
    });
    console.log(`✅ Test 4: Topics`);
    topics.forEach(t => {
      console.log(`   - ${t.topic}: ${t._count.topic} questions`);
    });
    console.log('');

    // Test 5: Filter by difficulty
    const easyQuestions = await prisma.codingQuestion.count({
      where: { difficulty: 'Easy' }
    });
    console.log(`✅ Test 5: Filter by Difficulty`);
    console.log(`   Easy questions: ${easyQuestions}\n`);

    console.log('🎉 All tests passed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Make sure your backend is running: npm run dev');
    console.log('   2. Visit http://localhost:5174/coding-questions');
    console.log('   3. Questions should now load!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

test();
