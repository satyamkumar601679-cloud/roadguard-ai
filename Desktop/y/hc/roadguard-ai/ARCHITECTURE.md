# 🛣️ RoadGuard AI - Project Architecture & Technical Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                           │
│  React 18 + Vite + TailwindCSS                             │
│  ├─ Image Upload Component                                 │
│  ├─ Detection Results Display                              │
│  ├─ Severity Assessment Card                               │
│  ├─ Interactive Leaflet Map                                │
│  ├─ Analytics Dashboard (Chart.js)                         │
│  └─ Report History Panel                                   │
└─────────────────────────────────────────────────────────────┘
            ↓ (Axios HTTP Requests)
┌─────────────────────────────────────────────────────────────┐
│                    API LAYER                                │
│  Flask REST API (http://localhost:5000)                    │
│  ├─ POST /detect - Pothole detection                       │
│  ├─ GET /reports - Fetch all reports                       │
│  ├─ GET /reports/stats - Get statistics                    │
│  └─ GET /health - Health check                             │
└─────────────────────────────────────────────────────────────┘
            ↓ (Python + OpenCV)
┌─────────────────────────────────────────────────────────────┐
│              PROCESSING LAYER                               │
│  ├─ Image Loading (cv2.imread)                             │
│  ├─ Preprocessing (Grayscale, Blur)                        │
│  ├─ Edge Detection (Canny)                                 │
│  ├─ Contour Analysis                                       │
│  ├─ Damage Classification (Size-based)                     │
│  └─ Image Encoding (Base64)                                │
└─────────────────────────────────────────────────────────────┘
            ↓ (REST API Calls)
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER                            │
│  Supabase (PostgreSQL Cloud)                               │
│  ├─ road_reports Table                                     │
│  ├─ Indexes (severity, priority, timestamp, location)      │
│  ├─ Row Level Security Policies                            │
│  └─ Real-time Subscriptions (ready for future)             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App.jsx (Main Container)
├── Header (Navigation & Title)
├── ImageUpload
│   ├── File Input
│   ├── Location Picker
│   └── Submit Button
├── DetectionResult (Conditional)
│   ├── Original Image
│   └── Processed Image
├── SeverityCard (Conditional)
│   ├── Severity Badge
│   ├── Priority Score
│   └── Damage Info
├── Map
│   ├── MapContainer (Leaflet)
│   ├── TileLayer (OpenStreetMap)
│   ├── Current Detection Marker
│   ├── Historical Report Markers
│   └── Popups
├── Dashboard
│   ├── Stats Cards
│   ├── Pie Chart (Severity Distribution)
│   └── Bar Chart (Priority Breakdown)
├── ReportHistory
│   ├── Report List
│   ├── Sort Controls
│   └── Report Items
└── Footer
```

---

## Data Flow

### Detection Flow
```
User Uploads Image
      ↓
Frontend creates FormData
      ↓
Sends POST /detect request
      ↓
Backend receives image
      ↓
OpenCV processes image:
  - Grayscale conversion
  - Gaussian blur
  - Canny edge detection
  - Contour finding
  - Area calculation
  - Severity classification
      ↓
Encode processed image to Base64
      ↓
Return detection results (JSON)
      ↓
Save to Supabase via REST API
      ↓
Frontend displays result
      ↓
Fetch all reports from Supabase
      ↓
Update map & analytics
```

### Retrieval Flow
```
App loads or user clicks refresh
      ↓
Frontend fetches from Supabase:
  - fetchRoadReports()
  - getReportStats()
      ↓
Supabase returns data (JSON)
      ↓
Frontend updates state
      ↓
Components re-render:
  - Map with new markers
  - Dashboard with new stats
  - Report history list
```

---

## Technology Breakdown

### Frontend Stack

**React 18**
- Modern component-based architecture
- Hooks for state management (useState, useEffect)
- Virtual DOM for performance

**Vite**
- Ultra-fast build tool
- HMR (Hot Module Reloading)
- Automatic JSX transform
- Optimized production builds

**TailwindCSS**
- Utility-first CSS framework
- Responsive design (mobile-first)
- Custom color schemes
- Dark mode ready

**Leaflet.js**
- Lightweight mapping library
- OpenStreetMap integration
- Custom markers with styling
- Interactive popups

**Chart.js + React-ChartJS**
- Data visualization
- Pie and bar charts
- Responsive design
- Animation support

**Axios**
- HTTP client library
- Request/response interceptors
- Error handling
- FormData support for file uploads

**Supabase Client**
- Real-time database client
- Authentication (future)
- Row-level security
- Subscriptions support

---

### Backend Stack

**Python 3.8+**
- Easy to learn and maintain
- Excellent data processing libraries
- Fast enough for hackathon
- Good for scaling to ML models

**Flask**
- Lightweight web framework
- Minimal dependencies
- RESTful API design
- CORS support out of box

**OpenCV (cv2)**
- Industry-standard computer vision library
- Edge detection (Canny algorithm)
- Contour detection
- Image transformation
- Base64 encoding

**NumPy**
- Numerical computing
- Array operations
- Statistical analysis

**Flask-CORS**
- Cross-Origin Resource Sharing
- Allow frontend to call backend
- Configurable origins

**Supabase Python Client**
- Database integration
- Error handling
- Rate limiting

---

## Algorithm Details

### Pothole Detection Algorithm

```python
1. IMAGE INPUT
   - Read image with OpenCV
   - Resize to 800x600 (performance)

2. PREPROCESSING
   - Convert to grayscale (intensity only)
   - Apply Gaussian blur (5x5 kernel)
   - Reduces noise and artifacts

3. EDGE DETECTION (Canny)
   - Lower threshold: 50
   - Upper threshold: 150
   - Find intensity gradients
   - Returns binary edge map

4. MORPHOLOGICAL OPERATIONS
   - Dilation with ellipse kernel (9x9)
   - Iterations: 2
   - Connects nearby edges

5. CONTOUR DETECTION
   - Find all enclosed boundaries
   - Use external contours
   - Approximate contours with chains

6. FILTERING
   - Min area threshold: 500 pixels
   - Removes noise and small artifacts
   - Keeps significant damage only

7. SEVERITY CALCULATION
   - Max area > 40,000px → HIGH
   - Area 20-40,000px → MEDIUM
   - Area < 20,000px → LOW
   - Priority = (area / max_area) * 100

8. VISUALIZATION
   - Draw bounding rectangles
   - Color intensity based on area
   - Add area labels
   - Encode to Base64 PNG
```

### Severity Scoring

```
Priority Score Calculation:
  score = (damage_area / reference_area) * 100
  
  reference_area = 50,000 pixels (benchmark)
  clipped to [0, 100]

Example:
  - 45,000 px area → score = 90 (HIGH)
  - 25,000 px area → score = 50 (MEDIUM)
  - 10,000 px area → score = 20 (LOW)
```

---

## Database Schema

### road_reports Table

| Column | Type | Nullable | Index | Purpose |
|--------|------|----------|-------|---------|
| `id` | BIGSERIAL | NO | PRIMARY KEY | Unique identifier |
| `image_url` | TEXT | YES | NO | Base64 encoded image |
| `severity_level` | VARCHAR(50) | NO | YES | High/Medium/Low |
| `priority_score` | INTEGER | YES | YES | 0-100 score |
| `latitude` | DECIMAL(10,6) | NO | YES | GPS latitude |
| `longitude` | DECIMAL(10,6) | NO | YES | GPS longitude |
| `timestamp` | TIMESTAMP | NO | YES | Detection time |
| `created_at` | TIMESTAMP | NO | NO | DB creation time |

### Indexes
- `idx_severity` - Fast severity filtering
- `idx_priority` - Sort by priority score
- `idx_timestamp` - Recent reports first
- `idx_location` - Geographic queries

---

## API Specifications

### Request/Response Examples

#### POST /detect
```
REQUEST:
  Method: POST
  Content-Type: multipart/form-data
  Body:
    - image: [binary file]
    - latitude: 37.7749
    - longitude: -122.4194

RESPONSE:
  Status: 200 OK
  Content-Type: application/json
  Body: {
    "processed_image": "data:image/png;base64,...",
    "severity_level": "High",
    "priority_score": 85,
    "latitude": 37.7749,
    "longitude": -122.4194,
    "damage_count": 3,
    "timestamp": "2024-03-04T12:30:45"
  }
```

#### GET /reports
```
RESPONSE:
  Status: 200 OK
  Content-Type: application/json
  Body: [
    {
      "id": 1,
      "image_url": "...",
      "severity_level": "High",
      "priority_score": 85,
      "latitude": 37.7749,
      "longitude": -122.4194,
      "timestamp": "2024-03-04T12:30:45+00:00",
      "created_at": "2024-03-04T12:30:45+00:00"
    },
    ...
  ]
```

---

## Performance Metrics

### Estimated Response Times
- Image preprocessing: 50-100ms
- Edge detection: 100-200ms
- Contour analysis: 50-100ms
- Total detection: 1-2 seconds (depending on image size)

### Database Performance
- Insert operation: 10-50ms
- Select all reports: 50-200ms (depends on record count)
- Full-text search: 100-500ms

### Frontend Performance
- Initial page load: < 2 seconds
- Map render: < 1 second
- Dashboard render: < 500ms

---

## Scalability Considerations

### Current Capacity
- Single Flask process: ~10 requests/second
- Supabase free: ~1000 records/month

### Scaling to Production
1. **Frontend**
   - Cache images locally
   - Lazy load components
   - Use CDN for static assets

2. **Backend**
   - Use Gunicorn with multiple workers
   - Add Redis caching
   - Implement rate limiting
   - Use async processing (Celery)

3. **Database**
   - Upgrade Supabase tier
   - Add read replicas
   - Archive old records
   - Implement partitioning by date

4. **Detection Service**
   - GPU acceleration (CUDA)
   - Model quantization
   - Batch processing
   - Distributed inference

---

## Security Considerations

### Current Implementation
- CORS enabled for localhost
- No authentication (hackathon mode)
- Images deleted after processing
- No sensitive data stored

### Production Recommendations
1. **Authentication**
   - JWT tokens
   - User-based access control
   - API key management

2. **Data Security**
   - HTTPS only
   - Encrypt sensitive fields
   - Audit logging
   - Data privacy compliance

3. **Input Validation**
   - File size limits (5MB)
   - Image format validation
   - Coordinate bounds checking
   - SQL injection prevention (via ORM)

4. **Rate Limiting**
   - Per-IP limits
   - Per-user quotas
   - Throttling mechanisms

---

## Testing Strategy

### Unit Tests (Ideal)
- Test OpenCV detection function
- Test severity calculation
- Test API endpoints
- Test React components

### Integration Tests
- Test frontend-backend communication
- Test database operations
- Test complete detection flow

### Testing Command (Future)
```bash
pytest backend/tests/
npm test frontend/
```

---

## Deployment Guide

### Deploy Backend (Heroku Example)
```bash
heroku create roadguard-ai-backend
git push heroku main
heroku config:set SUPABASE_URL=...
heroku config:set SUPABASE_KEY=...
```

### Deploy Frontend (Vercel Example)
```bash
vercel deploy
Add environment variables in Vercel dashboard
```

### Docker Deployment
```dockerfile
FROM python:3.9
WORKDIR /app
COPY backend/ .
RUN pip install -r requirements.txt
CMD ["gunicorn", "app:app"]
```

---

## Future Enhancements

1. **Multi-class Detection**
   - Cracks
   - Fading markings
   - Debris

2. **Machine Learning Models**
   - YOLO for object detection
   - CNN for damage classification
   - Transfer learning

3. **Real-time Processing**
   - Stream from dashcams
   - Live video processing
   - Continuous monitoring

4. **Advanced Features**
   - 3D pothole depth estimation
   - Repair crew assignment
   - Cost estimation
   - Weather correlation

5. **Mobile Integration**
   - React Native app
   - Offline mode
   - GPS background tracking

---

## Troubleshooting Guide

### Common Issues

**Issue: Detection timeout**
- Solution: Reduce image size, upgrade server

**Issue: Memory leak**
- Solution: Delete temp images after processing

**Issue: Database overload**
- Solution: Implement query caching, pagination

---

## Code Quality Standards

### Frontend
- ESLint configuration
- Prettier formatting
- React best practices
- Accessibility (a11y)

### Backend
- PEP 8 compliance
- Type hints (Python 3.8+)
- Docstrings
- Error logging

---

## Monitoring & Logging

### Recommended Tools
- **Frontend:** Sentry for error tracking
- **Backend:** CloudWatch or Datadog
- **Database:** Supabase dashboard
- **Performance:** New Relic or Datadog

---

## Conclusion

RoadGuard AI demonstrates a complete ML pipeline:
✅ Data collection → Image upload  
✅ Processing → OpenCV detection  
✅ Visualization → Map & dashboard  
✅ Persistence → Cloud database  
✅ Analytics → Real-time statistics  

This architecture is production-ready with proper scaling and security hardening.

---

**Built for Hackathons. Scalable to Cities. Powered by AI.** 🛣️🚀
