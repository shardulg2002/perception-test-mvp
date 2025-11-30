# Deployment Guide

## Deploying to Vercel

### Method 1: Using Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm i -g vercel
   ```

2. Navigate to your project directory:
   ```bash
   cd Road_traffic_Accident_Test
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy:
   ```bash
   vercel
   ```

5. Follow the prompts and add environment variables when asked.

### Method 2: Using Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Perception Test MVP"
   git branch -M main
   git remote add origin https://github.com/yourusername/perception-test.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`

3. **Add Environment Variables**
   In Vercel project settings, add:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `your-project.vercel.app`

## Supabase Configuration Checklist

Before deployment, ensure:

- [x] Created Supabase project
- [x] Ran `supabase_schema.sql` in SQL Editor
- [x] Verified table `perception_attempts` exists
- [x] Checked RLS policies are enabled
- [x] Copied project URL and anon key
- [x] Added environment variables to Vercel

## Testing the Deployment

1. Visit your Vercel URL
2. Click "Start Test"
3. Complete a test
4. Check Dashboard to verify data is saved
5. Test on mobile device

## Troubleshooting Deployment

### Build Fails

Check:
- All dependencies are in `package.json`
- No syntax errors in code
- Build command is correct: `npm run build`

### Environment Variables Not Working

- Ensure variables start with `VITE_` prefix
- Redeploy after adding/changing variables
- Check capitalization matches exactly

### Supabase Connection Issues

- Verify URL and key are correct
- Check Supabase project is not paused
- Ensure RLS policies allow public access

### 404 on Page Refresh

- Verify `vercel.json` exists with rewrites
- Check deployment settings in Vercel dashboard

## Custom Domain (Optional)

1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Configure DNS records as instructed
5. Wait for SSL certificate provisioning

## Performance Optimization

After deployment:
- Enable Vercel Analytics (optional)
- Monitor Core Web Vitals
- Test on different devices/browsers
- Check Lighthouse scores

## Continuous Deployment

Vercel automatically redeploys when you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push
```

Your site will automatically rebuild and deploy.
