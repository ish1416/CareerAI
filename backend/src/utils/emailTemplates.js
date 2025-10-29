const BRAND_COLOR = '#6366f1';
const BRAND_NAME = 'CareerAI';

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${BRAND_NAME}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: ${BRAND_COLOR}; padding: 32px 24px; text-align: center; }
    .logo { color: white; font-size: 28px; font-weight: 800; margin: 0; }
    .content { padding: 32px 24px; }
    .button { display: inline-block; background: ${BRAND_COLOR}; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 16px 0; }
    .footer { background: #f1f5f9; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
    .divider { height: 1px; background: #e2e8f0; margin: 24px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">${BRAND_NAME}</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© 2024 ${BRAND_NAME}. All rights reserved.</p>
      <p>This email was sent to you because you have an account with ${BRAND_NAME}.</p>
    </div>
  </div>
</body>
</html>
`;

export const emailTemplates = {
  verification: (verifyUrl, name = '') => baseTemplate(`
    <h2>Welcome to ${BRAND_NAME}${name ? `, ${name}` : ''}! 🎉</h2>
    <p>Thank you for joining ${BRAND_NAME}, the AI-powered platform that helps you create outstanding resumes and land your dream job.</p>
    
    <p>To get started and access all our features, please verify your email address:</p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${verifyUrl}" class="button">Verify Email Address</a>
    </div>
    
    <p>Once verified, you'll be able to:</p>
    <ul>
      <li>✨ Build professional resumes with AI assistance</li>
      <li>📊 Get detailed ATS analysis and scoring</li>
      <li>🎯 Match your resume against job descriptions</li>
      <li>📝 Generate tailored cover letters</li>
    </ul>
    
    <div class="divider"></div>
    
    <p><strong>Having trouble?</strong> If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: ${BRAND_COLOR};">${verifyUrl}</p>
    
    <p>This verification link will expire in 48 hours for security reasons.</p>
  `),

  passwordReset: (resetUrl, name = '') => baseTemplate(`
    <h2>Password Reset Request</h2>
    <p>Hello${name ? ` ${name}` : ''},</p>
    
    <p>We received a request to reset your ${BRAND_NAME} account password. If you didn't make this request, you can safely ignore this email.</p>
    
    <p>To reset your password, click the button below:</p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </div>
    
    <div class="divider"></div>
    
    <p><strong>Security Notice:</strong></p>
    <ul>
      <li>This link will expire in 1 hour</li>
      <li>You can only use this link once</li>
      <li>If you didn't request this reset, please secure your account</li>
    </ul>
    
    <p><strong>Having trouble?</strong> Copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: ${BRAND_COLOR};">${resetUrl}</p>
  `),

  welcome: (name = '') => baseTemplate(`
    <h2>Welcome to ${BRAND_NAME}${name ? `, ${name}` : ''}! 🚀</h2>
    
    <p>Your email has been successfully verified! You now have full access to all ${BRAND_NAME} features.</p>
    
    <h3>🎯 Quick Start Guide</h3>
    <ol>
      <li><strong>Build Your Resume:</strong> Use our AI-powered resume builder to create a professional resume</li>
      <li><strong>Analyze & Optimize:</strong> Get detailed ATS analysis and improvement suggestions</li>
      <li><strong>Match Jobs:</strong> Compare your resume against job descriptions</li>
      <li><strong>Generate Cover Letters:</strong> Create tailored cover letters for each application</li>
    </ol>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5174'}/dashboard" class="button">Get Started Now</a>
    </div>
    
    <div class="divider"></div>
    
    <h3>💡 Pro Tips</h3>
    <ul>
      <li>Use action verbs and quantify your achievements</li>
      <li>Tailor your resume for each job application</li>
      <li>Aim for an ATS score of 80+ for better visibility</li>
      <li>Keep your resume concise but impactful</li>
    </ul>
    
    <p>Need help? Our support team is here to assist you at every step of your career journey.</p>
  `),

  planUpgrade: (planName, features) => baseTemplate(`
    <h2>🎉 Welcome to ${BRAND_NAME} ${planName}!</h2>
    
    <p>Congratulations! Your account has been successfully upgraded to ${planName}. You now have access to premium features that will supercharge your job search.</p>
    
    <h3>✨ Your New Features</h3>
    <ul>
      ${features.map(feature => `<li>${feature}</li>`).join('')}
    </ul>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5174'}/dashboard" class="button">Explore Premium Features</a>
    </div>
    
    <p>Thank you for choosing ${BRAND_NAME} to advance your career. We're excited to help you land your dream job!</p>
  `),

  supportTicket: (ticketId, issue) => baseTemplate(`
    <h2>Support Ticket Created</h2>
    
    <p>We've received your support request and our team will get back to you within 24 hours.</p>
    
    <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
      <p><strong>Ticket ID:</strong> #${ticketId}</p>
      <p><strong>Issue:</strong> ${issue}</p>
    </div>
    
    <p>In the meantime, you might find answers in our help center or community forum.</p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5174'}/help" class="button">Visit Help Center</a>
    </div>
  `)
};

// Plain text versions for better deliverability
export const textTemplates = {
  verification: (verifyUrl, name = '') => `
Welcome to ${BRAND_NAME}${name ? `, ${name}` : ''}!

Thank you for joining ${BRAND_NAME}. To get started, please verify your email address by clicking this link:

${verifyUrl}

Once verified, you'll have access to:
- AI-powered resume builder
- ATS analysis and scoring
- Job matching tools
- Cover letter generator

This link expires in 48 hours.

If you have any questions, feel free to contact our support team.

Best regards,
The ${BRAND_NAME} Team
  `,

  passwordReset: (resetUrl, name = '') => `
Password Reset Request

Hello${name ? ` ${name}` : ''},

We received a request to reset your ${BRAND_NAME} password. Click this link to reset it:

${resetUrl}

This link expires in 1 hour and can only be used once.

If you didn't request this reset, please ignore this email.

Best regards,
The ${BRAND_NAME} Team
  `,

  welcome: (name = '') => `
Welcome to ${BRAND_NAME}${name ? `, ${name}` : ''}!

Your email has been verified! You now have full access to all features.

Quick Start:
1. Build your resume with AI assistance
2. Analyze and optimize for ATS
3. Match against job descriptions
4. Generate tailored cover letters

Get started: ${process.env.FRONTEND_URL || 'http://localhost:5174'}/dashboard

Best regards,
The ${BRAND_NAME} Team
  `
};