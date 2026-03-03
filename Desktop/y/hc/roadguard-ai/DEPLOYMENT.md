# 🚀 RoadGuard AI - Production Deployment Guide

## Build Status
✅ Frontend built successfully (dist/ folder ready)  
✅ Backend optimized for production  
✅ All dependencies installed  

## Quick Deployment Options

### Option 1: Vercel (Recommended for Frontend) ⚡

**1. Install Vercel CLI:**
```bash
npm install -g vercel
```

**2. Deploy Frontend:**
```bash
cd frontend
vercel
```

**3. Configure Environment Variables in Vercel Dashboard:**
```
VITE_API_URL=https://your-backend-domain.com
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
```

**Cost:** Free tier available, $20/month for pro  
**Deployment Time:** < 2 minutes  
**Auto-scaling:** Yes  

---

### Option 2: Netlify (Alternative Frontend) 🎨

**1. Connect Repository:**
- Go to https://netlify.com
- Click "New site from Git"
- Connect GitHub/GitLab repo

**2. Build Settings:**
```
Build command: npm run build
Publish directory: dist
```

**3. Set Environment Variables:**
In Netlify Dashboard → Site Settings → Build & Deploy → Environment:
```
VITE_API_URL=https://your-backend-domain.com
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
```

**Cost:** Free tier with unlimited bandwidth  
**Deployment Time:** < 2 minutes  

---

### Option 3: Render (Backend) 🔵

**1. Push Backend to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

**2. Deploy on Render:**
- Go to https://render.com
- Click "New +" → "Web Service"
- Connect GitHub repository
- Select `backend` directory (if in subdirectory)

**3. Configure:**
```
Build Command: pip install -r requirements.txt
Start Command: gunicorn -w 4 -b 0.0.0.0:$PORT app:app
Environment Variables:
  - FLASK_ENV=production
  - SUPABASE_URL=your_supabase_url
  - SUPABASE_KEY=your_supabase_key
```

**Cost:** Free tier with 0.5GB RAM, $7/month for standard  
**Deployment Time:** 3-5 minutes  

---

### Option 4: Heroku (Legacy Backend)

**1. Install Heroku CLI:**
```bash
npm install -g heroku
heroku login
```

**2. Create Procfile:**
```
web: gunicorn -w 4 -b 0.0.0.0:$PORT app:app
```

**3. Deploy:**
```bash
cd backend
heroku create roadguard-ai
git push heroku main
heroku config:set FLASK_ENV=production
heroku config:set SUPABASE_URL=your_supabase_url
heroku config:set SUPABASE_KEY=your_supabase_key
```

**Cost:** Paid only (was free until Nov 2022)  

---

### Option 5: AWS EC2 (Full Control)

**1. Launch EC2 Instance:**
- Ubuntu 22.04 LTS
- t2.micro (free tier eligible)
- Security group: Allow 80, 443, 5000

**2. SSH Into Instance:**
```bash
ssh -i key.pem ubuntu@your-instance-ip
```

**3. Install Dependencies:**
```bash
sudo apt-get update
sudo apt-get install -y python3.11 python3-pip nodejs npm nginx
```

**4. Clone Repository:**
```bash
git clone your-repo-url
cd roadguard-ai
```

**5. Setup Backend:**
```bash
cd backend
pip install -r requirements.txt
pip install gunicorn
```

**6. Setup Nginx Reverse Proxy:**
```bash
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
upstream api {
    server 127.0.0.1:5000;
}

server {
    listen 80 default_server;
    server_name _;

    location /api {
        proxy_pass http://api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        root /home/ubuntu/roadguard-ai/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

**7. Start Services:**
```bash
cd backend
gunicorn -w 4 -b 127.0.0.1:5000 app:app &
sudo systemctl restart nginx
```

**Cost:** $5-15/month  
**Scalability:** Manual  

---

### Option 6: DigitalOcean App Platform

**1. Create New App:**
- Go to https://cloud.digitalocean.com
- Click "Create" → "Apps"
- Connect GitHub repository

**2. Configure Components:**

**Frontend (Node.js):**
```
Source: frontend/
Build: npm install && npm run build
Run: npx serve -s dist -l 3000
```

**Backend (Python):**
```
Source: backend/
Build: pip install -r requirements.txt
Run: gunicorn -w 4 -b 0.0.0.0:$APP_DOMAIN app:app
```

**3. Set Environment Variables:**
```
FLASK_ENV=production
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

**Cost:** $5/month minimum  
**Deployment Time:** 5-10 minutes  

---

### Option 7: Docker + Any Host

**1. Build Docker Image:**
```bash
cd backend
docker build -t roadguard-api .
docker tag roadguard-api your-docker-registry/roadguard-api:latest
docker push your-docker-registry/roadguard-api:latest
```

**2. Run Container:**
```bash
docker run -d \
  -p 5000:5000 \
  -e FLASK_ENV=production \
  -e SUPABASE_URL=your_supabase_url \
  -e SUPABASE_KEY=your_supabase_key \
  your-docker-registry/roadguard-api:latest
```

**3. Deploy to Docker Hub / AWS ECR / Google Container Registry**

---

## Recommended Setup (Best Value)

### Frontend: Vercel (Free)
- Deploy `frontend/dist` folder
- Auto-scaling, CDN, SSL included
- Environment variables configured

### Backend: Render (Free/Paid)
- Deploy backend folder
- Auto-deploys on git push
- 0.5GB RAM free, scales up as needed

### Database: Supabase (Free)
- PostgreSQL included in free tier
- Up to 1 million rows
- Real-time capabilities

**Total Monthly Cost:** $0-7 (free tiers available)

---

## Pre-Deployment Checklist

- [ ] Create `.env` with all required variables
- [ ] Set `FLASK_ENV=production` in backend
- [ ] Build frontend with `npm run build`
- [ ] Test everything locally with production build
- [ ] Update API URLs in frontend config
- [ ] Enable HTTPS/SSL on all domains
- [ ] Configure CORS on backend:
  ```python
  CORS(app, origins=[
      "https://your-frontend-domain.com",
      "https://roadguard-ai.vercel.app"
  ])
  ```
- [ ] Setup database backups
- [ ] Enable rate limiting on API endpoints
- [ ] Configure logging and monitoring

---

## Environment Variables Required

### Backend (.env)
```
FLASK_ENV=production
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your_anon_key_here
```

### Frontend (Vercel/Netlify/etc)
```
VITE_API_URL=https://your-api.domain.com
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_KEY=your_anon_key_here
```

---

## Post-Deployment Verification

1. **Check Frontend:**
   ```bash
   curl https://your-frontend-domain.com
   ```

2. **Check Backend Health:**
   ```bash
   curl https://your-api-domain.com/health
   ```

3. **Test File Upload:**
   ```bash
   curl -X POST \
     -F "image=@test.jpg" \
     -F "latitude=37.7749" \
     -F "longitude=-122.4194" \
     https://your-api-domain.com/detect
   ```

4. **Monitor Logs:**
   - Vercel: Dashboard → Functions → Logs
   - Render: Dashboard → Service → Logs
   - AWS EC2: `tail -f /var/log/syslog`

---

## Performance Optimization

### Frontend
- Images are optimized (gzip: 3.93 KB)
- CSS is minified (gzip: 3.93 KB)
- JavaScript is bundled (720 KB total)
- CDN recommended for global distribution

### Backend
- Use 4-8 worker processes (based on vCPU count)
- Enable caching for Supabase queries
- Compress images before processing
- Implement request rate limiting

---

## Scaling Considerations

As traffic grows:

1. **Frontend:**
   - CDN caching (automatic on Vercel/Netlify)
   - Service workers for offline capability
   - Image lazy-loading already implemented

2. **Backend:**
   - Increase worker count: `gunicorn -w 8`
   - Add database connection pooling
   - Implement image processing queue (Celery)
   - Cache detection results

3. **Database:**
   - Upgrade Supabase tier
   - Add read replicas for scaling
   - Archive old reports to cold storage

---

## Troubleshooting

**"Module not found" errors:**
```bash
pip install -r requirements.txt
npm install
```

**CORS errors:**
Add to backend app.py:
```python
CORS(app, origins="*")  # Dev only
```

**Supabase connection fails:**
- Check credentials in `.env`
- Verify Supabase project is active
- Check row-level security policies

**Large file uploads fail:**
- Increase Nginx body size limit:
  ```
  client_max_body_size 10M;
  ```
- Compress images client-side

---

## Security Best Practices

✅ Never commit `.env` files  
✅ Use environment variables for secrets  
✅ Enable HTTPS/SSL everywhere  
✅ Set restrictive CORS policies  
✅ Validate all file uploads (type, size)  
✅ Implement rate limiting  
✅ Use signed URLs for image access  
✅ Enable database encryption  
✅ Regular security audits  
✅ Keep dependencies updated  

---

## Support & Monitoring

**Error Tracking:**
- Sentry.io (free tier)
- Vercel error logs
- CloudWatch (AWS)

**Uptime Monitoring:**
- UptimeRobot (free)
- Pingdom
- CloudFlare

**Performance Monitoring:**
- Vercel Analytics
- New Relic (free tier)
- DataDog

---

**Ready to deploy!** Choose your platform and follow the instructions above. 🚀
