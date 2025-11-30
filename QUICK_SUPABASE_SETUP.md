# 🚀 QUICK SUPABASE SETUP (5 Minutes)

## Step 1: Create Supabase Account
- Go to: **https://supabase.com**
- Click "Start your project" → Sign up with GitHub

## Step 2: Create New Project
- Click "New Project"
- Name: `road-traffic-test`
- Password: (create and save it)
- Region: Choose closest to you
- Click "Create new project" → Wait 2 mins

## Step 3: Get API Keys
- Go to **Settings** (⚙️) → **API**
- Copy these two values:

```
Project URL: https://xxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Update .env File
Open `.env` file and paste your values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 5: Create Database Tables
- In Supabase dashboard: **SQL Editor** (</>) → **New query**
- Copy all content from `supabase_schema.sql`
- Paste and click **Run**
- Should see: "Database schema created successfully!"

## Step 6: Restart App
```powershell
npm run dev
```

## Step 7: Test It
1. Complete all 3 experiments in your app
2. Check Supabase → **Table Editor** → `test_sessions`
3. You should see your data! 🎉

---

## For Vercel Deployment

Add environment variables in Vercel dashboard:

**Settings** → **Environment Variables** → Add:
- `VITE_SUPABASE_URL` = your URL
- `VITE_SUPABASE_ANON_KEY` = your key

Then redeploy.

---

## ✅ How to Verify It's Working

**Browser Console should show:**
```
Session successfully saved to Supabase
```

**Admin Dashboard should show:**
```
(Supabase)  ← This means data is from database
```

---

## 📊 What Gets Saved

- ✅ All 5 Perception Test trials
- ✅ All 5 Fuel Pump trials  
- ✅ All 5 Illusion scenarios
- ✅ Candidate demographics
- ✅ Timestamps and client info

---

## Need Help?

Check `SUPABASE_SETUP.md` for detailed troubleshooting!
