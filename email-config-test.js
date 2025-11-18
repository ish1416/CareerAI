#!/usr/bin/env node

import fetch from 'node-fetch';

const BACKEND_URL = 'https://careerai-backend-iakw.onrender.com';

async function checkEmailConfig() {
  console.log('🔍 Checking Email Configuration in Production\n');
  
  try {
    // Create a simple endpoint test
    const response = await fetch(`${BACKEND_URL}/api/health`);
    
    if (response.ok) {
      console.log('✅ Backend is accessible');
      
      // Check if we can see any email-related logs by triggering a registration
      console.log('\n📧 Testing email configuration by checking registration response...');
      
      const testResponse = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'https://careerai-frontend-5keb.onrender.com'
        },
        body: JSON.stringify({
          name: 'Config Test',
          email: 'configtest@example.com',
          password: 'TestPassword123!'
        })
      });
      
      console.log('📊 Registration Status:', testResponse.status);
      const responseText = await testResponse.text();
      console.log('📄 Response:', responseText);
      
      console.log('\n🔍 Email Configuration Issues to Check:');
      console.log('1. EMAIL_HOST environment variable');
      console.log('2. EMAIL_PORT environment variable');
      console.log('3. EMAIL_USER environment variable');
      console.log('4. EMAIL_PASS environment variable');
      console.log('5. EMAIL_FROM environment variable');
      
      console.log('\n💡 Common Issues:');
      console.log('- Missing SMTP credentials in Render environment variables');
      console.log('- SMTP server blocking connections');
      console.log('- Incorrect SMTP settings');
      console.log('- Email provider requiring app-specific passwords');
      
      console.log('\n🔧 To Fix:');
      console.log('1. Check Render dashboard > Environment Variables');
      console.log('2. Verify SMTP settings with your email provider');
      console.log('3. Check backend logs for detailed error messages');
      
    } else {
      console.log('❌ Cannot connect to backend');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

checkEmailConfig();