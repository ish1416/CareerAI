# 🚀 Supabase PostgreSQL Setup

## Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login
3. Click "New Project"
4. Choose organization and enter:
   - **Name**: CareerAI
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to you

## Step 2: Get Database URL
1. In your Supabase dashboard, go to **Settings** → **Database**
2. Scroll down to **Connection string**
3. Copy the **URI** (it looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

## Step 3: Update Environment
Replace `YOUR_SUPABASE_DATABASE_URL_HERE` in `backend/.env` with your actual URL:
```bash
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

## Step 4: Run Migrations
```bash
cd backend
rm -rf prisma/migrations
npx prisma generate
npx prisma migrate dev --name init
```

## Step 5: Start Server
```bash
node src/index.js
```

✅ Your CareerAI will now use Supabase PostgreSQL!