# Supabase Setup Guide

## Quick Setup Steps

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name:** Road Traffic Test (or any name)
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to your users
5. Click "Create new project" and wait for setup to complete (~2 minutes)

### 2. Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** (⚙️ icon in left sidebar)
2. Click **API**
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string under "Project API keys")

### 3. Configure Your Application

1. Open the `.env` file in your project root
2. Replace the placeholder values:
   ```env
   VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```
3. Save the file

### 4. Create Database Tables

1. In your Supabase dashboard, click **SQL Editor** (</> icon in left sidebar)
2. Click **New query**
3. Copy the entire contents of `supabase_schema.sql` file
4. Paste it into the SQL editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see success messages

### 5. Verify Tables Created

1. Go to **Table Editor** (📊 icon in left sidebar)
2. You should see two tables:
   - `test_sessions` - Stores complete session data
   - `perception_attempts` - Stores individual perception test attempts

### 6. Restart Development Server

```powershell
# Stop the current server (Ctrl+C if running)
npm run dev
```

### 7. Test the Setup

1. Go to your application
2. Complete all 3 experiments
3. Check your Supabase dashboard → **Table Editor** → `test_sessions`
4. You should see your session data!

## Vercel Deployment

When deploying to Vercel, you need to add the environment variables:

1. Go to your Vercel project dashboard
2. Click **Settings**
3. Click **Environment Variables**
4. Add two variables:
   - **Name:** `VITE_SUPABASE_URL`, **Value:** Your Supabase URL
   - **Name:** `VITE_SUPABASE_ANON_KEY`, **Value:** Your Supabase anon key
5. Click **Save**
6. Redeploy your application

## Database Schema Overview

### `test_sessions` table
Stores complete session data for all 3 experiments:
- `session_id` - Unique session identifier
- `candidate_name` - User's name
- `application_number` - License application number
- `perception_results` - JSON array of all perception test trials
- `fuel_pump_result` - JSON object with fuel pump game results
- `illusion_result` - JSON object with all 5 scenario results
- `client_info` - Browser and device information

### `perception_attempts` table
Stores individual perception test attempts (backward compatibility):
- `session_id` - Links to session
- `visible_duration_ms` - How long car was visible
- `reaction_latency_ms` - User's reaction time
- `outcome` - success or collision
- Full timing and position data

## Data Flow

1. **User completes all tests** → Data saved to localStorage (immediate backup)
2. **After Experiment 3 completes** → Complete session saved to Supabase
3. **Admin Dashboard** → Loads from Supabase first, falls back to localStorage

## Troubleshooting

### "Supabase not configured" in console
- Check if `.env` file exists and has correct values
- Restart development server after editing `.env`
- Verify environment variables don't have quotes around values

### "Failed to save to Supabase" errors
- Check if SQL schema was run successfully
- Verify Row Level Security policies are created
- Check Supabase project is not paused (free tier pauses after inactivity)

### No data in Supabase tables
- Check browser console for errors
- Verify `.env` values are correct
- Make sure you completed all 3 experiments (data saves after Experiment 3)
- Check Network tab to see if API calls are being made

### Admin Dashboard shows localStorage instead of Supabase
- This means Supabase connection failed
- Check environment variables are set
- Verify database schema is created
- Data will still work, just stored locally

## Security Notes

- The `anon` key is safe to expose in frontend code
- Row Level Security (RLS) is enabled for protection
- Current policies allow public read/write for MVP
- For production, implement proper authentication

## Optional: Setup Authentication

If you want to add user authentication later:

1. Go to **Authentication** in Supabase
2. Enable email authentication
3. Update RLS policies to check `auth.uid()`
4. Modify frontend to use Supabase Auth

## Data Export

Admin dashboard provides:
- **CSV Export** - For Excel/spreadsheet analysis
- **JSON Export** - Complete raw data
- Both exports work with Supabase and localStorage data

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
