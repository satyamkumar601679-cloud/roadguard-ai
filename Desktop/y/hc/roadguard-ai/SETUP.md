# RoadGuard AI - Detailed Setup Guide

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Python 3.8+ installed
- [ ] Supabase account created
- [ ] Git installed (optional)
- [ ] Text editor or IDE

---

## Complete Step-by-Step Setup

### 1. Supabase Database Setup

#### Create Supabase Project
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Choose your region (closest to your location)
4. Create a strong password
5. Wait for project to initialize (~2 minutes)

#### Get API Credentials
1. Go to **Settings** > **API**
2. Copy **Project URL** (you'll need this)
3. Copy **anon public** key (you'll need this)
4. Save both in a safe place

#### Create Database Table
1. Go to **SQL Editor** in left sidebar
2. Click **New Query**
3. Copy the entire content from `SQL_SETUP.sql`
4. Paste into the SQL editor
5. Click **Run**
6. Verify success (table should appear in Tables list)

---

### 2. Backend Setup (Flask)

#### Navigate to Backend Directory
```bash
cd roadguard-ai/backend
```

#### Create Virtual Environment

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**What you should see:**
```
(venv) C:\path\to\roadguard-ai\backend>
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

**Installation takes ~3-5 minutes. Wait for it to complete.**

#### Configure Environment
```bash
# Copy the template
cp .env.example .env
```

**Edit `.env` file:**
```
FLASK_ENV=development
FLASK_DEBUG=True
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_KEY=YOUR_ANON_KEY
```

Replace with your actual Supabase credentials from step 1.

#### Test Backend
```bash
python app.py
```

**Success indicators:**
- "Running on http://127.0.0.1:5000"
- No error messages
- Flask is serving on localhost:5000

**Keep this terminal open!** (Backend must be running)

#### Test API Health
Open a new terminal and run:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"healthy","service":"RoadGuard AI Backend"}
```

---

### 3. Frontend Setup (React + Vite)

#### Open New Terminal Window
(Keep backend terminal open in another window)

```bash
cd roadguard-ai/frontend
```

#### Install Dependencies
```bash
npm install
```

**Installation takes ~2-3 minutes.**

#### Configure Environment
```bash
cp .env.example .env.local
```

**Edit `.env.local` file:**
```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_KEY=YOUR_ANON_KEY
```

Use the **same** Supabase credentials from step 1.

#### Start Development Server
```bash
npm run dev
```

**Success indicators:**
- "Local: http://localhost:3000/"
- "press h to show help"
- No error messages

#### Open in Browser
```
http://localhost:3000
```

---

## Verification Checklist

### Backend Running?
- [ ] Terminal shows "Running on http://127.0.0.1:5000"
- [ ] `curl http://localhost:5000/health` returns JSON
- [ ] No Python errors in console

### Frontend Running?
- [ ] Terminal shows "Local: http://localhost:3000/"
- [ ] Browser loads app at localhost:3000
- [ ] Header shows "RoadGuard AI" with gradient background

### Supabase Connected?
- [ ] `road_reports` table exists in Supabase
- [ ] No red error messages in browser console
- [ ] Upload form is accessible

---

## Testing the System

### Quick Test Workflow

1. **Open browser** to `http://localhost:3000`
2. **Click "Upload Road Image"**
3. **Select any image** from your computer (or use test image)
4. **Click "Get Current Location"** (or manually enter coordinates)
5. **Click "Analyze Road Damage"**
6. **Wait for results** (processing takes 2-3 seconds)
7. **View:**
   - Original image on left
   - Detected damage on right
   - Severity level and priority score
   - Map marker at location

### What to Look For

✅ Image appears processed with bounding boxes  
✅ Severity level is shown (High/Medium/Low)  
✅ Priority score is between 0-100  
✅ Location appears on the map  
✅ Report appears in history list  

---

## Troubleshooting Guide

### Issue: "Backend not running" Error

**Solution:**
```bash
# Terminal 1 - Backend
cd roadguard-ai/backend
source venv/bin/activate  # (venv\Scripts\activate on Windows)
python app.py
```

Ensure you see: `Running on http://127.0.0.1:5000`

### Issue: "ModuleNotFoundError" in Backend

**Solution:**
```bash
cd backend
pip install -r requirements.txt --force-reinstall
```

### Issue: Frontend Won't Load

**Solution:**
```bash
cd frontend
npm cache clean --force
rm -rf node_modules
npm install
npm run dev
```

### Issue: "Cannot Connect to Supabase"

**Checklist:**
- [ ] `.env` file has SUPABASE_URL
- [ ] `.env.local` file has VITE_SUPABASE_URL
- [ ] URLs match your Supabase project URL
- [ ] API keys are correct (anon, not secret key)
- [ ] Table `road_reports` exists in Supabase
- [ ] RLS policies allow public access

To verify Supabase:
```bash
curl -H "apikey: YOUR_ANON_KEY" \
  "https://YOUR_PROJECT_ID.supabase.co/rest/v1/road_reports?select=count()"
```

### Issue: Port Already in Use

**For Port 5000 (Backend):**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
sudo lsof -i :5000
kill -9 <PID>
```

**For Port 3000 (Frontend):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
sudo lsof -i :3000
kill -9 <PID>
```

---

## Development Tips

### Hot Reload
- **Frontend:** Changes auto-reflect at localhost:3000
- **Backend:** Save `app.py` to reload (dev mode enabled)

### Debugging
- **Browser:** Press F12 to open DevTools
- **Console tab:** Check for JavaScript errors
- **Network tab:** Monitor API calls to backend

### Testing Images
For best results, use images with:
- Visible cracks or damage
- Clear road surface
- Good lighting
- At least 640x480 resolution

### Database Queries
Check Supabase records:
1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Select `road_reports`
4. View all submitted detections

---

## Building for Production

### Frontend Build
```bash
cd frontend
npm run build
```

Output files in `frontend/dist/` - ready for deployment

### Backend Production
```bash
pip install gunicorn
cd backend
gunicorn -w 4 app:app --bind 0.0.0.0:5000
```

---

## Environment Variables Reference

### Backend `.env`
```
FLASK_ENV=development           # development or production
FLASK_DEBUG=True                # Enable debug mode
SUPABASE_URL=https://...        # Your Supabase project URL
SUPABASE_KEY=eyJ...             # Supabase anon key
```

### Frontend `.env.local`
```
VITE_SUPABASE_URL=https://...   # Your Supabase project URL
VITE_SUPABASE_KEY=eyJ...        # Supabase anon key
```

---

## Quick Start (Tldr Version)

```bash
# Terminal 1: Backend
cd roadguard-ai/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with Supabase credentials
python app.py

# Terminal 2: Frontend
cd roadguard-ai/frontend
npm install
cp .env.example .env.local
# Edit .env.local with Supabase credentials
npm run dev

# Browser
Open http://localhost:3000
```

---

## Getting Help

**Check these first:**
1. Are both backend and frontend running? (2 terminal windows needed)
2. Is Supabase project created and database table exists?
3. Are environment variables correct in `.env` files?
4. Check browser console (F12) for errors
5. Check backend console for Python errors

**Common Success Indicators:**
- Backend: "Running on http://127.0.0.1:5000"
- Frontend: "Local: http://localhost:3000"
- Browser: Page loads, no console errors
- Database: Table appears in Supabase

---

## Next Steps

1. ✅ Complete setup from above
2. 📸 Test with sample images
3. 🗺️ View results on interactive map
4. 📊 Check analytics dashboard
5. 🚀 Ready for hackathon presentation!

---

**You're all set! Good luck with your hackathon!** 🛣️🤖
