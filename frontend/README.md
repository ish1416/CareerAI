# CareerAI Frontend (Vite + React)

A minimal frontend for CareerAI with authentication, dashboard, resume builder, AI analysis, job matching, and cover letter generation.

## Prerequisites
- Node.js 18+
- Backend running at `http://localhost:5000` (see backend README / .env)

## Quickstart
1. Install deps:
   ```bash
   cd frontend
   npm install
   ```
2. Configure environment (optional):
   - Create `.env` and set `VITE_API_URL` (defaults to `http://localhost:5000/api`)
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```
   Open the URL shown (typically `http://localhost:5173`).

## Features
- Auth: login/register, token persistence, logout
- Dashboard: resume count, average ATS, last analysis date
- Resume Builder: sections, upload PDF/DOCX, AI-enhance fields, save versions
- Analysis: paste text and get ATS suggestions/keywords
- Job Match: compare resume vs JD and see match/keywords
- Cover Letter: generate and edit tailored letters
- Settings: update name, delete account

## Routes
- `/login`, `/register`
- `/dashboard`
- `/builder`
- `/analysis`
- `/match`
- `/cover`
- `/settings`

## Configuration
- Axios is preconfigured to add `Authorization: Bearer <token>` from localStorage
- Base URL reads `import.meta.env.VITE_API_URL` with fallback to `http://localhost:5000/api`

## Troubleshooting
- Ensure backend server is running and accessible.
- For database operations, run Prisma migrations in backend:
  ```bash
  cd backend
  npm run prisma:migrate -- --name init
  npm run dev
  ```
- If AI keys are missing, responses use deterministic fallbacks; add keys in backend `.env` for better outputs.

## Notes
- This frontend uses a simple black/white theme (`src/styles/theme.css` + `src/index.css`).
- JWT-based logout is client-side; server provides a no-op endpoint.
