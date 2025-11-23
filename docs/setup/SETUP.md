# 🚀 CareerAI Setup Guide

## Quick Start

### 1. Environment Setup ✅
- Backend `.env` file created with basic configuration
- Frontend `.env` file created with API URL
- Dependencies installed for both frontend and backend

### 2. Start Development Servers

**Option A: Separate terminals (Recommended)**

Terminal 1 - Backend:
```bash
./start-backend.sh
```

Terminal 2 - Frontend:
```bash
./start-frontend.sh
```

**Option B: Manual start**

Terminal 1 - Backend:
```bash
cd backend
node src/index.js
```

Terminal 2 - Frontend:
```bash
cd frontend  
npm run dev
```

### 3. Access the Application
- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/api/health

## Database Setup (Optional)

The app will work without a database for basic functionality, but for full features:

1. Install PostgreSQL locally or use a cloud service
2. Update `DATABASE_URL` in `backend/.env`
3. Run migrations:
```bash
cd backend
npx prisma migrate dev
```

## AI Features Setup (Optional)

To enable AI features, add API keys to `backend/.env`:
- `GROQ_API_KEY` - Free AI API from Groq
- `OPENAI_API_KEY` - OpenAI API key
- Other AI providers as needed

## Features Available

### ✅ Ready to Use (No Setup Required)
- Resume builder interface
- Cover letter generator UI
- Job tracking interface
- Portfolio builder
- Interview prep tools
- Career analytics dashboard

### 🔧 Requires Configuration
- AI-powered resume analysis (needs AI API keys)
- Email notifications (needs SMTP setup)
- Payment processing (needs Stripe keys)
- Google OAuth login (needs Google credentials)

## Troubleshooting

### Port Already in Use
If ports 5001 or 5174 are busy:
```bash
# Kill processes on these ports
lsof -ti:5001 | xargs kill -9
lsof -ti:5174 | xargs kill -9
```

### Database Connection Issues
- Check PostgreSQL is running
- Verify DATABASE_URL in backend/.env
- Run `npx prisma generate` in backend folder

## Next Steps

1. **Start the servers** using one of the methods above
2. **Open http://localhost:5174** in your browser
3. **Register a new account** to test the features
4. **Configure AI APIs** for full functionality (optional)

Happy coding! 🎉