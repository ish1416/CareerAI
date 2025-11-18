#!/usr/bin/env node

import fetch from 'node-fetch';

const BACKEND_URL = 'https://careerai-backend-iakw.onrender.com';
const TEST_EMAIL = 'jogibhupendra45@gmail.com'; // Change this to your email

async function checkBackendStatus() {
  console.log('🔍 Checking backend status...\n');
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Backend is healthy');
      console.log('📊 Status:', data);
      return true;
    } else {
      console.log('❌ Backend health check failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Cannot connect to backend:', error.message);
    return false;
  }
}

async function testEmailVerification() {
  console.log('\n📧 Testing Email Verification...\n');
  
  const testUser = {
    name: 'Email Test User',
    email: TEST_EMAIL,
    password: 'TestPassword123!'
  };

  try {
    // Test registration
    console.log('1️⃣ Testing user registration...');
    const registerResponse = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://careerai-frontend-5keb.onrender.com'
      },
      body: JSON.stringify(testUser)
    });

    console.log('📊 Register Status:', registerResponse.status);
    
    if (registerResponse.status === 502) {
      console.log('❌ Server Error (502) - Backend is having issues');
      console.log('🔧 Check backend logs for database connection or other errors');
      return;
    }

    const registerText = await registerResponse.text();
    
    if (!registerResponse.ok) {
      console.log('❌ Registration failed');
      console.log('📄 Response:', registerText);
      
      if (registerText.includes('Email already registered')) {
        console.log('ℹ️ User already exists, testing login instead...');
        await testLogin(testUser);
        return;
      }
      return;
    }

    const registerData = JSON.parse(registerText);
    console.log('✅ Registration successful');
    console.log('🎫 Token received:', registerData.token ? 'Yes' : 'No');
    console.log('👤 User data:', registerData.user);
    
    if (registerData.user && !registerData.user.emailVerified) {
      console.log('📧 Email verification required - check your inbox!');
    }

    // Test resend verification
    await testResendVerification(registerData.token);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

async function testLogin(testUser) {
  try {
    console.log('🔑 Testing login...');
    const loginResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://careerai-frontend-5keb.onrender.com'
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });

    console.log('📊 Login Status:', loginResponse.status);
    
    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      console.log('❌ Login failed:', errorText);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful');
    console.log('👤 User verified:', loginData.user.emailVerified);
    
    if (!loginData.user.emailVerified) {
      console.log('📧 Email not verified - testing resend...');
      await testResendVerification(loginData.token);
    }

  } catch (error) {
    console.error('❌ Login test failed:', error.message);
  }
}

async function testResendVerification(token) {
  try {
    console.log('\n2️⃣ Testing resend verification...');
    const resendResponse = await fetch(`${BACKEND_URL}/api/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Origin': 'https://careerai-frontend-5keb.onrender.com'
      }
    });

    console.log('📊 Resend Status:', resendResponse.status);
    
    if (resendResponse.ok) {
      const resendData = await resendResponse.json();
      console.log('✅ Verification email resent successfully');
      console.log('📧 Check your email inbox and spam folder');
      console.log('📄 Response:', resendData.message);
    } else {
      const errorText = await resendResponse.text();
      console.log('❌ Resend failed:', errorText);
    }

  } catch (error) {
    console.error('❌ Resend test failed:', error.message);
  }
}

async function runEmailTest() {
  console.log('🚀 CareerAI Email Verification Test');
  console.log('=' .repeat(50));
  console.log(`📧 Testing with email: ${TEST_EMAIL}`);
  console.log(`🌐 Backend URL: ${BACKEND_URL}`);
  console.log('=' .repeat(50));

  const isHealthy = await checkBackendStatus();
  
  if (isHealthy) {
    await testEmailVerification();
  } else {
    console.log('❌ Cannot proceed - backend is not healthy');
  }

  console.log('\n' + '=' .repeat(50));
  console.log('📋 Test Summary:');
  console.log('1. If you see 502 errors, check backend logs for database issues');
  console.log('2. If registration works, check your email for verification');
  console.log('3. Check spam folder if no email received');
  console.log('4. Backend logs will show detailed email sending information');
}

runEmailTest().catch(console.error);