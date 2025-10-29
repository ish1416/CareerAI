#!/usr/bin/env node

// CareerAI Deployment Verification Script
console.log('🚀 CareerAI Deployment Verification\n');

const tests = [
  {
    name: 'Backend Dependencies',
    test: () => {
      try {
        require('./backend/src/middleware/rateLimiter.js');
        require('./backend/src/middleware/errorHandler.js');
        require('./backend/src/routes/health.js');
        return { success: true, message: 'All middleware imports working' };
      } catch (error) {
        return { success: false, message: error.message };
      }
    }
  },
  {
    name: 'Frontend Components',
    test: () => {
      const fs = require('fs');
      const components = [
        './frontend/src/components/ResumeTemplates.jsx',
        './frontend/src/components/JobMatcher.jsx',
        './frontend/src/components/InterviewPrep.jsx',
        './frontend/src/components/CareerInsights.jsx',
        './frontend/src/components/FeatureShowcase.jsx'
      ];
      
      for (const component of components) {
        if (!fs.existsSync(component)) {
          return { success: false, message: `Missing component: ${component}` };
        }
      }
      return { success: true, message: 'All components exist' };
    }
  },
  {
    name: 'Package Dependencies',
    test: () => {
      try {
        const backendPkg = require('./backend/package.json');
        const frontendPkg = require('./frontend/package.json');
        
        const requiredBackend = ['helmet', 'express-rate-limit', 'prisma', 'express'];
        const requiredFrontend = ['react', 'vite', 'lucide-react'];
        
        for (const dep of requiredBackend) {
          if (!backendPkg.dependencies[dep]) {
            return { success: false, message: `Missing backend dependency: ${dep}` };
          }
        }
        
        for (const dep of requiredFrontend) {
          if (!frontendPkg.dependencies[dep] && !frontendPkg.devDependencies[dep]) {
            return { success: false, message: `Missing frontend dependency: ${dep}` };
          }
        }
        
        return { success: true, message: 'All dependencies present' };
      } catch (error) {
        return { success: false, message: error.message };
      }
    }
  },
  {
    name: 'Environment Files',
    test: () => {
      const fs = require('fs');
      const files = [
        './backend/.env.example',
        './frontend/.env.example',
        './FREE_DEPLOYMENT.md',
        './DEPLOYMENT_GUIDE.md'
      ];
      
      for (const file of files) {
        if (!fs.existsSync(file)) {
          return { success: false, message: `Missing file: ${file}` };
        }
      }
      return { success: true, message: 'All deployment files present' };
    }
  }
];

let passed = 0;
let failed = 0;

for (const test of tests) {
  process.stdout.write(`Testing ${test.name}... `);
  const result = test.test();
  
  if (result.success) {
    console.log('✅ PASS');
    passed++;
  } else {
    console.log('❌ FAIL');
    console.log(`   Error: ${result.message}`);
    failed++;
  }
}

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('\n🎉 All tests passed! Your CareerAI is ready for deployment.');
  console.log('\n📋 Next Steps:');
  console.log('1. Follow FREE_DEPLOYMENT.md for free hosting');
  console.log('2. Get Groq API key (free): https://console.groq.com');
  console.log('3. Deploy to Railway, Render, or Vercel');
  console.log('4. Test all features after deployment');
} else {
  console.log('\n⚠️  Some tests failed. Please fix the issues above before deploying.');
  process.exit(1);
}