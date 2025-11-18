#!/usr/bin/env node

import fetch from 'node-fetch';

const BACKEND_URL = 'https://careerai-backend-iakw.onrender.com';

async function testEndpoints() {
  console.log('🧪 Testing CareerAI Backend Endpoints\n');

  // Test 1: Health check
  try {
    console.log('1️⃣ Testing health endpoint...');
    const response = await fetch(`${BACKEND_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('Response:', text.substring(0, 200));
    
    if (response.headers.get('content-type')?.includes('application/json')) {
      const data = JSON.parse(text);
      console.log('✅ Health check successful:', data);
    } else {
      console.log('❌ Expected JSON but got:', response.headers.get('content-type'));
    }
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }

  console.log('\n' + '-'.repeat(50) + '\n');

  // Test 2: Register endpoint
  try {
    console.log('2️⃣ Testing register endpoint...');
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': 'https://careerai-frontend-5keb.onrender.com'
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPassword123!'
      })
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('Response:', text.substring(0, 500));
    
  } catch (error) {
    console.error('❌ Register test failed:', error.message);
  }

  console.log('\n' + '-'.repeat(50) + '\n');

  // Test 3: Check CORS
  try {
    console.log('3️⃣ Testing CORS preflight...');
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://careerai-frontend-5keb.onrender.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('Status:', response.status);
    console.log('CORS Headers:', {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
      'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials')
    });
    
  } catch (error) {
    console.error('❌ CORS test failed:', error.message);
  }
}

testEndpoints().catch(console.error);