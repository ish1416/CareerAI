import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

console.log('Testing email with:');
console.log('User:', process.env.EMAIL_USER);
console.log('Pass length:', process.env.EMAIL_PASS?.length);
console.log('Pass (first 4 chars):', process.env.EMAIL_PASS?.substring(0, 4));

try {
  const result = await transporter.verify();
  console.log('✅ Email configuration is valid!');
} catch (error) {
  console.error('❌ Email test failed:', error.message);
}