# 🚀 Backend Deployment to Render - Step by Step

## Current Status
✅ Frontend: Live on Vercel  
⏳ Backend: Ready to deploy

## Option 1: Deploy via GitHub + Render (Recommended) ⭐

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Sign in (create account if needed)
3. Repository name: `roadguard-ai`
4. Description: `Smart road damage detection and repair planning system`
5. Public (so Render can access it)
6. Click "Create repository"

### Step 2: Push Code to GitHub

```bash
# Navigate to project directory
cd c:\Users\acer\Desktop\y\hc\roadguard-ai

# Initialize/update git
git add .
git commit -m "RoadGuard AI - Production Ready"

# Add remote (copy from GitHub repo page)
git remote add origin https://github.com/YOUR_USERNAME/roadguard-ai.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy Backend on Render

1. **Visit Render Dashboard:**
   - Go to https://render.com
   - Sign in or create account
   - Click "New +"

2. **Create Web Service:**
   - Select "Web Service"
   - Paste GitHub repo URL: `https://github.com/YOUR_USERNAME/roadguard-ai.git`
   - Connect GitHub account
   - Authorize Render

3. **Configure Service:**
   - **Name:** `roadguard-api`
   - **Root Directory:** Leave empty (uses root)
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `cd backend && gunicorn -w 4 -b 0.0.0.0:$PORT app:app`
   - **Plan:** Free (0.5GB RAM)

4. **Add Environment Variables:**
   - Click "Advanced" → "Add Environment Variable"
   - Add these:
     ```
     FLASK_ENV=production
     SUPABASE_URL=your_supabase_url
     SUPABASE_KEY=your_supabase_key
     ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait 3-5 minutes for deployment
   - Get URL from dashboard

---

## Option 2: Direct Docker Deployment on Render

1. Go to https://render.com/docs/deploy-docker
2. Create Docker image (already have Dockerfile)
3. Push to Docker Hub or GitHub Container Registry
4. Deploy on Render

---

## Option 3: Railway.app Deployment (Easy Alternative)

1. **Visit:** https://railway.app
2. **Connect GitHub:** Authorize GitHub
3. **Select Repository:** roadguard-ai
4. **Add Service:**
   - Name: `roadguard-api`
   - Start Command: `cd backend && gunicorn -w 4 -b 0.0.0.0:$PORT app:app`
5. **Environment Variables:** Add Supabase credentials
6. **Deploy:** Automatic

---

## Option 4: Heroku Alternative (Paid)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
cd backend
heroku create roadguard-api

# Add buildpack
heroku buildpacks:add heroku/python

# Deploy
git push heroku main

# Add environment variables
heroku config:set FLASK_ENV=production
heroku config:set SUPABASE_URL=your_supabase_url
heroku config:set SUPABASE_KEY=your_supabase_key
```

---

## After Backend Deployment

Once your backend is live:

1. **Get Backend URL** (from Render/Railway dashboard)
   - Example: `https://roadguard-api.onrender.com`

2. **Update Frontend Environment Variable:**
   - Go to Vercel Dashboard
   - Settings → Environment Variables
   - Update: `VITE_API_URL=https://roadguard-api.onrender.com`
   - Redeploy

3. **Test Integration:**
   ```bash
   # Test backend health
   curl https://roadguard-api.onrender.com/health
   
   # Test frontend
   # Visit: https://sales-website-eight.vercel.app
   # Try uploading an image
   ```

---

## Troubleshooting

**Build fails on Render:**
- Check `.gitignore` doesn't exclude `requirements.txt`
- Verify Start Command is correct
- Check environment variables are set

**CORS Error:**
- Backend CORS is configured correctly
- But update frontend API URL in environment variables

**Supabase connection fails:**
- Verify credentials are correct
- Check Supabase project is active
- Enable API in Supabase dashboard

**Large file sizes:**
- OpenCV is ~100MB
- This is normal and included in Render free tier

---

## Final Deployment Status

```
✅ Frontend: https://sales-website-eight.vercel.app (LIVE)
⏳ Backend: Pending (follow steps above)
⏳ Database: Supabase (needs credentials in env vars)
```

**Estimated Time:** 5-10 minutes total  
**Total Cost:** $0 (both free tiers)

---

## Quick Command Reference

```bash
# From roadguard-ai folder:

# Step 1: Check status
git status

# Step 2: Commit everything
git add .
git commit -m "RoadGuard AI - Production Deploy"

# Step 3: Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/roadguard-ai.git

# Step 4: Push to GitHub
git branch -M main
git push -u origin main

# Then: Go to Render.com and follow the Web Service creation steps above
```

---

**Next Action:** Choose your deployment option and follow the steps! 🚀
