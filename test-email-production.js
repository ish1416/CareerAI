#!/usr/bin/env node

import fetch from 'node-fetch';

const BACKEND_URL = 'https://careerai-backend-iakw.onrender.com';
const TEST_EMAIL = 'ishita1642006@gmail.com'; // Change this to your email

async function testEmailVerification() {
  console.log('🧪 Testing Email Verification in Production...\n');

  try {
    // Step 1: Register a test user
    console.log('1️⃣ Registering test user...');
    const registerResponse = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: TEST_EMAIL,
        password: 'TestPassword123!',
      }),
    });

    const registerData = await registerResponse.json();
    
    if (!registerResponse.ok) {
      console.log('❌ Registration failed:', registerData.error);
      if (registerData.error === 'Email already registered') {
        console.log('ℹ️ User already exists, testing resend verification...\n');
        await testResendVerification();
        return;
      }
      return;
    }

    console.log('✅ User registered successfully');
    console.log('📧 Check your email for verification link\n');

    // Step 2: Test resend verification
    await testResendVerification(registerData.token);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

async function testResendVerification(token) {
  try {
    console.log('2️⃣ Testing resend verification...');
    
    // First login to get token if not provided
    if (!token) {
      console.log('🔑 Logging in first...');
      const loginResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: TEST_EMAIL,
          password: 'TestPassword123!',
        }),
      });

      const loginData = await loginResponse.json();
      if (!loginResponse.ok) {
        console.log('❌ Login failed:', loginData.error);
        return;
      }
      token = loginData.token;
      console.log('✅ Login successful');
    }

    // Resend verification
    const resendResponse = await fetch(`${BACKEND_URL}/api/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const resendData = await resendResponse.json();
    
    if (resendResponse.ok) {
      console.log('✅ Verification email resent successfully');
      console.log('📧 Check your email for verification link');
    } else {
      console.log('❌ Resend failed:', resendData.error);
    }

  } catch (error) {
    console.error('❌ Resend test failed:', error.message);
  }
}

async function testEmailConfig() {
  console.log('\n3️⃣ Testing email configuration...');
  
  try {
    // Check if backend is responding
    const healthResponse = await fetch(`${BACKEND_URL}/api/health`);
    const healthData = await healthResponse.json();
    
    if (healthResponse.ok) {
      console.log('✅ Backend is healthy:', healthData.message);
    } else {
      console.log('❌ Backend health check failed');
      return;
    }

    // Test basic connectivity
    console.log('🔍 Backend URL:', BACKEND_URL);
    console.log('📧 Test email:', TEST_EMAIL);
    
  } catch (error) {
    console.error('❌ Backend connectivity test failed:', error.message);
  }
}

// Run the tests
async function runTests() {
  console.log('🚀 CareerAI Email Verification Test\n');
  console.log('=' .repeat(50));
  
  await testEmailConfig();
  await testEmailVerification();
  
  console.log('\n' + '=' .repeat(50));
  console.log('✅ Test completed! Check the backend logs for detailed email information.');
  console.log('📧 Check your email inbox and spam folder for verification emails.');
}

runTests().catch(console.error);