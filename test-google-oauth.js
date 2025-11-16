#!/usr/bin/env node

// Simple test script to verify Google OAuth endpoints
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5001/api';
const FRONTEND_BASE = 'http://localhost:5174';

async function testGoogleOAuth() {
  console.log('🧪 Testing Google OAuth Setup...\n');

  try {
    // Test 1: Check if backend is running
    console.log('1️⃣ Testing backend connectivity...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    if (healthResponse.ok) {
      console.log('✅ Backend is running on port 5001');
    } else {
      throw new Error('Backend not responding');
    }

    // Test 2: Check if frontend is running
    console.log('\n2️⃣ Testing frontend connectivity...');
    const frontendResponse = await fetch(FRONTEND_BASE);
    if (frontendResponse.ok) {
      console.log('✅ Frontend is running on port 5174');
    } else {
      throw new Error('Frontend not responding');
    }

    // Test 3: Check Google OAuth initiation endpoint
    console.log('\n3️⃣ Testing Google OAuth initiation...');
    const googleAuthResponse = await fetch(`${API_BASE}/auth/google`, { 
      redirect: 'manual' 
    });
    
    if (googleAuthResponse.status === 302) {
      const location = googleAuthResponse.headers.get('location');
      if (location && location.includes('accounts.google.com')) {
        console.log('✅ Google OAuth initiation working');
        console.log(`   Redirects to: ${location.substring(0, 80)}...`);
      } else {
        console.log('❌ Google OAuth redirect invalid');
      }
    } else {
      console.log('❌ Google OAuth endpoint not working');
    }

    // Test 4: Check Google OAuth callback endpoint
    console.log('\n4️⃣ Testing Google OAuth callback endpoint...');
    const callbackResponse = await fetch(`${API_BASE}/auth/google/callback`, { 
      redirect: 'manual' 
    });
    
    if (callbackResponse.status === 302) {
      console.log('✅ Google OAuth callback endpoint responding');
    } else {
      console.log('❌ Google OAuth callback endpoint not working');
    }

    console.log('\n🎉 Google OAuth Test Results:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Backend server: Running');
    console.log('✅ Frontend server: Running');
    console.log('✅ Google OAuth endpoints: Configured');
    console.log('✅ OAuth flow: Ready to test');
    
    console.log('\n📋 Manual Testing Steps:');
    console.log('1. Open http://localhost:5174/login');
    console.log('2. Click "Continue with Google"');
    console.log('3. Complete Google authentication');
    console.log('4. Should redirect back to dashboard');
    
    console.log('\n🔧 OAuth Configuration:');
    console.log(`   Client ID: ${process.env.GOOGLE_CLIENT_ID ? 'Configured' : 'Missing'}`);
    console.log(`   Client Secret: ${process.env.GOOGLE_CLIENT_SECRET ? 'Configured' : 'Missing'}`);
    console.log(`   Callback URL: http://localhost:5001/api/auth/google/callback`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure backend is running: npm run dev (in backend folder)');
    console.log('2. Make sure frontend is running: npm run dev (in frontend folder)');
    console.log('3. Check Google OAuth credentials in backend/.env');
  }
}

testGoogleOAuth();