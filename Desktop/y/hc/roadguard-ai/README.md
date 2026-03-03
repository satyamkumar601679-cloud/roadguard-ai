# 🛣️ RoadGuard AI - Smart Road Damage Detection & Repair Planning

## Overview

**RoadGuard AI** is a hackathon-ready AI-powered system designed for city authorities to detect road damage (potholes), prioritize repairs, and plan infrastructure maintenance efficiently. The system combines computer vision, real-time mapping, and analytics to create a smart city infrastructure monitoring platform.

## Key Features

✅ **AI-Powered Pothole Detection** - Upload road images for automatic damage detection  
✅ **Severity Assessment** - Automatic classification (Low/Medium/High) with priority scoring  
✅ **Interactive Map** - Leaflet-based map showing pot hole locations with color-coded markers  
✅ **Database Storage** - All detections saved in Supabase for historical tracking  
✅ **City Dashboard** - Real-time analytics with charts showing damage statistics  
✅ **Report History** - Complete list of all detected potholes with sorting and filtering  
✅ **Responsive Design** - Mobile-friendly UI built with TailwindCSS  
✅ **Dark Mode Support** - Toggle between light and dark themes for better accessibility  
✅ **Auto-Refresh Capability** - Automatic data updates every 30 seconds (toggle on/off)  
✅ **CSV Data Export** - Download all reports as CSV for external analysis  
✅ **Enhanced Input Validation** - File size, type, and coordinate validation  
✅ **Toast Notifications** - Real-time user feedback for all actions  

## Tech Stack

### Frontend
- **React 18** with Vite
- **TailwindCSS** for styling
- **Leaflet.js + OpenStreetMap** for mapping
- **Chart.js** for analytics
- **Axios** for API calls
- **Supabase Client** for real-time database

### Backend
- **Python Flask** - REST API server
- **OpenCV** - Image processing & edge detection
- **NumPy** - Numerical computing
- **Flask-CORS** - Cross-origin requests

### Database
- **Supabase (PostgreSQL)** - Cloud database for report storage

### Tools
- **Vite** - Fast build tool
- **Leaflet** - Interactive maps
- **Chart.js** - Data visualization

## Project Structure

```
roadguard-ai/
├── backend/
│   ├── app.py                 # Flask API with OpenCV detection
│   ├── requirements.txt        # Python dependencies
│   └── uploads/               # Temporary image storage
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageUpload.jsx      # Image upload form
│   │   │   ├── DetectionResult.jsx  # Shows detection results
│   │   │   ├── SeverityCard.jsx     # Severity assessment card
│   │   │   ├── Map.jsx              # Interactive pothole map
│   │   │   ├── Dashboard.jsx        # Analytics dashboard
│   │   │   └── ReportHistory.jsx    # Report list
│   │   ├── App.jsx            # Main application component
│   │   ├── main.jsx           # React entry point
│   │   ├── index.css          # Tailwind styles
│   │   └── supabaseClient.js  # Supabase configuration
│   ├── index.html             # HTML template
│   ├── package.json           # NPM dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # TailwindCSS config
│   ├── postcss.config.js      # PostCSS config
│   └── .env.example           # Environment variables template
├── SQL_SETUP.sql              # Database table creation
├── SETUP.md                   # Detailed setup guide
└── README.md                  # This file
```

## Installation Guide

### Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **Python 3.8+** - [Download](https://www.python.org/)
- **Supabase Account** - [Create Free Account](https://supabase.com/)
- **Git** - [Download](https://git-scm.com/)

### Step 1: Clone Repository

```bash
git clone <your-repo-url> roadguard-ai
cd roadguard-ai
```

### Step 2: Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com/)
2. Go to SQL Editor and execute the SQL from `SQL_SETUP.sql`
3. Get your API credentials:
   - Project URL (Settings > API)
   - Anon Key (Settings > API)

### Step 3: Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your Supabase credentials
# SUPABASE_URL=your_url
# SUPABASE_KEY=your_key

# Run Flask server
python app.py
```

The backend will run at `http://localhost:5000`

### Step 4: Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
# VITE_SUPABASE_URL=your_url
# VITE_SUPABASE_KEY=your_key

# Start dev server
npm run dev
```

The frontend will run at `http://localhost:3000`

## API Endpoints

### Health Check
**GET** `/health`
```json
{
  "status": "healthy",
  "service": "RoadGuard AI Backend"
}
```

### Detect Potholes
**POST** `/detect`
**Input:** multipart/form-data
- `image` (file): Road image to analyze
- `latitude` (float): Latitude coordinate
- `longitude` (float): Longitude coordinate

**Response:**
```json
{
  "processed_image": "data:image/png;base64,..../",
  "severity_level": "High|Medium|Low",
  "priority_score": 0-100,
  "latitude": 37.7749,
  "longitude": -122.4194,
  "damage_count": 3,
  "timestamp": "2024-03-04T12:30:00"
}
```

### Get All Reports
**GET** `/reports`
**Response:** Array of report objects

### Get Statistics
**GET** `/reports/stats`
**Response:**
```json
{
  "total": 25,
  "high": 5,
  "medium": 8,
  "low": 12
}
```

## How the AI Detection Works

1. **Image Input** - User uploads a road photo
2. **Grayscale Conversion** - Convert to grayscale for processing
3. **Gaussian Blur** - Reduce noise with blur filter
4. **Edge Detection** - Use Canny edge detection to find boundaries
5. **Dilation** - Connect nearby edges to form shapes
6. **Contour Detection** - Find all enclosed regions
7. **Filtering** - Remove small noise, keep only significant damage areas
8. **Severity Scoring** - Calculate damage size and severity level
9. **Visualization** - Draw bounding boxes and return processed image

## Severity Classification

| Size | Severity | Priority Score | Color |
|------|----------|-----------------|-------|
| Large (>40k px) | High | 70-100 | 🔴 Red |
| Medium (20-40k px) | Medium | 40-70 | 🟡 Yellow |
| Small (<20k px) | Low | 0-40 | 🟢 Green |

## Using the Application

### 1. Upload an Image
- Click "Upload Road Image"
- Select a road photo from your device
- Optionally get GPS location for auto-detection
- Click "Analyze Road Damage"

### 2. View Results
- See original and processed images side-by-side
- Check damage count and severity level
- View repair priority score (0-100%)

### 3. Analyze on Map
- Interactive map shows the pothole location
- All previous detections appear as markers
- Color-coded by severity (Red/Yellow/Green)
- Click markers to view details

### 4. Check Analytics
- Dashboard shows total detected potholes
- Pie chart of severity distribution
- Bar chart breakdown by priority level
- Real-time statistics

### 5. Review History
- Scroll through all past reports
- Sort by date, priority, or severity
- Click any report to view details
- See timestamps on the map

## Running the Project

### Terminal 1: Backend
```bash
cd roadguard-ai/backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py
```

### Terminal 2: Frontend
```bash
cd roadguard-ai/frontend
npm run dev
```

### Open Browser
Navigate to `http://localhost:3000`

## Hackathon Demo Flow

Perfect for impressing judges in under 5 minutes:

1. **Introduction (30 sec)**
   - "This is RoadGuard AI, a smart city infrastructure monitoring system"

2. **Upload Demo (1 min)**
   - Upload a test road image
   - Show live detection results
   - Highlight severity scoring

3. **Map Interaction (1 min)**
   - Show interactive map with markers
   - Click markers to view details
   - Demonstrate color-coded severity system

4. **Dashboard Showcase (1 min)**
   - Show analytics dashboard
   - Display charts and statistics
   - Explain repair prioritization

5. **Database Feature (1 min)**
   - Show report history
   - Explain Supabase integration
   - Discuss scalability to entire city

6. **Key Technical Points (30 sec)**
   - OpenCV AI detection
   - Real-time mapping
   - Cloud database automation
   - Responsive design

## Testing with Sample Images

To test the system, use road images that show:
- Visible damage areas
- Clear road surface
- Different lighting conditions

The AI detection works best with:
- Clear, well-lit images
- Close-up shots of damage
- High-quality photos (minimum 640x480)

## Troubleshooting

### Backend Won't Start
```bash
# Check Python version
python --version  # Should be 3.8+

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Check port availability
netstat -tulpn | grep 5000
```

### Frontend Won't Load
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install

# Check Vite port
netstat -tulpn | grep 3000
```

### Supabase Connection Issues
- Verify API credentials in `.env` files
- Check Supabase project is active
- Ensure database table exists (run SQL_SETUP.sql)
- Check RLS policies allow access

### No GPS Location
- Browser needs location permission
- Use manual latitude/longitude input
- Default location (San Francisco) will be used

## Performance Optimization

### Frontend
- Lazy loading components
- Image optimization
- CSS minification in production
- Efficient state management

### Backend
- Image resizing (800x600)
- Caching of processed images
- Database indexing
- Connection pooling

### Deployment
```bash
# Frontend build
cd frontend
npm run build
# Output in frontend/dist/

# Backend production
cd backend
gunicorn -w 4 app:app --bind 0.0.0.0:5000
```

## Future Enhancements

- 🚗 Integration with autonomous vehicles
- 📱 Mobile app version
- 🎯 Machine learning model for better accuracy
- 👥 Multi-user collaboration
- 📧 Automated email reports to authorities
- 💰 Damage cost estimation
- 🛠️ Repair crew assignment
- 📊 Predictive maintenance planning

## Contributing

Contributions are welcome! To contribute:
1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - Feel free to use this for your hackathon!

## Support

For issues or questions:
- Check SETUP.md for detailed configuration
- Review API endpoints documentation
- Check browser console for errors
- Ensure backend is running on port 5000
- Verify Supabase credentials

---

**Built for Hackathons. Ready for Cities. Powered by AI.** 🛣️🤖
