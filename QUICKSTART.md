# 🚀 Quick Start Guide

## Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Supabase (Required for data storage)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to SQL Editor and run this command (copy from `supabase_schema.sql`):
   - Click "New Query"
   - Paste the SQL from `supabase_schema.sql`
   - Click "Run"
4. Get your credentials:
   - Go to Project Settings > API
   - Copy "Project URL"
   - Copy "anon public" key

### Step 3: Configure Environment

Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 4: Run the App
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Step 5: Test It!

1. Click **"How it Works"** to understand the test
2. Click **"Start Test"**
3. Watch the car move for 5 seconds
4. When it disappears, press **STOP** (or spacebar) before collision
5. View your results
6. Check the **Dashboard** to see all attempts

## 🎯 What You Built

✅ **Perception Test** with SVG car animation  
✅ **Timing System** using high-precision `performance.now()`  
✅ **Auto-save** to Supabase database  
✅ **Analytics Dashboard** with filters and CSV export  
✅ **Responsive Design** for mobile and desktop  
✅ **No login required** - guest mode enabled  

## 📁 Project Files

- `src/components/TestCanvas.jsx` - Main test logic
- `src/pages/Home.jsx` - Test page
- `src/pages/Dashboard.jsx` - Analytics
- `supabase_schema.sql` - Database schema

## 🔧 Customization

Want to adjust difficulty? Edit `src/components/TestCanvas.jsx`:

```javascript
const CONFIG = {
  VISIBLE_DURATION: 5000,  // Change to 3000 for harder, 7000 for easier
  SPEED: 100,              // Increase for faster car
  OBSTACLE_X: 700,         // Move obstacle closer/farther
};
```

## 🚢 Deploy to Production

See `DEPLOYMENT.md` for detailed instructions.

Quick deploy to Vercel:
```bash
npm i -g vercel
vercel
```

## ❓ Troubleshooting

**"Supabase not configured" warning?**
- Check `.env` file exists
- Verify credentials are correct
- Restart dev server: `Ctrl+C` then `npm run dev`

**Test not saving results?**
- Ensure Supabase schema was created
- Check browser console for errors
- Verify RLS policies in Supabase

**Need help?** Check README.md for full documentation.

---

**You're all set! 🎉**
