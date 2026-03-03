# RoadGuard AI - API Documentation

## Base URL
- **Development:** `http://localhost:5000`
- **Production:** `https://your-domain.com`

---

## Endpoints

### 1. Health Check

**Endpoint:** `GET /health`

**Description:** Check if the backend service is running and healthy.

**Request:**
```bash
curl http://localhost:5000/health
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "RoadGuard AI Backend"
}
```

---

### 2. Detect Pothole Damage

**Endpoint:** `POST /detect`

**Description:** Upload a road image for AI-powered pothole detection.

**Request Headers:**
```
Content-Type: multipart/form-data
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | File | Yes | Image file (jpg, png, etc.) |
| `latitude` | Float | No | Latitude coordinate (default: 0) |
| `longitude` | Float | No | Longitude coordinate (default: 0) |

**Example cURL:**
```bash
curl -X POST http://localhost:5000/detect \
  -F "image=@/path/to/road.jpg" \
  -F "latitude=37.7749" \
  -F "longitude=-122.4194"
```

**Response (200 OK):**
```json
{
  "processed_image": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "severity_level": "High",
  "priority_score": 85,
  "latitude": 37.7749,
  "longitude": -122.4194,
  "damage_count": 3,
  "timestamp": "2024-03-04T12:30:45.123456"
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `processed_image` | String | Base64-encoded processed image with detection boxes |
| `severity_level` | String | One of: "High", "Medium", "Low" |
| `priority_score` | Integer | 0-100, higher = more urgent |
| `latitude` | Float | Input latitude coordinate |
| `longitude` | Float | Input longitude coordinate |
| `damage_count` | Integer | Number of damage areas detected |
| `timestamp` | String | ISO 8601 timestamp of detection |

**Error Response (400 Bad Request):**
```json
{
  "error": "No image provided"
}
```

---

### 3. Get All Reports

**Endpoint:** `GET /reports`

**Description:** Retrieve all stored pothole detection reports.

**Request:**
```bash
curl http://localhost:5000/reports
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "image_url": "data:image/png;base64,...",
    "severity_level": "High",
    "priority_score": 85,
    "latitude": 37.7749,
    "longitude": -122.4194,
    "timestamp": "2024-03-04T12:30:45+00:00",
    "created_at": "2024-03-04T12:30:45+00:00"
  },
  {
    "id": 2,
    "image_url": "data:image/png;base64,...",
    "severity_level": "Medium",
    "priority_score": 42,
    "latitude": 37.7755,
    "longitude": -122.4188,
    "timestamp": "2024-03-04T11:15:30+00:00",
    "created_at": "2024-03-04T11:15:30+00:00"
  }
]
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | Integer | Unique report ID |
| `image_url` | String | Base64-encoded processed image |
| `severity_level` | String | "High", "Medium", or "Low" |
| `priority_score` | Integer | 0-100 priority score |
| `latitude` | Float | Latitude coordinate |
| `longitude` | Float | Longitude coordinate |
| `timestamp` | String | When detection was made (UTC) |
| `created_at` | String | When record was created in DB |

---

### 4. Get Statistics

**Endpoint:** `GET /reports/stats`

**Description:** Get summary statistics of all reports.

**Request:**
```bash
curl http://localhost:5000/reports/stats
```

**Response (200 OK):**
```json
{
  "total": 25,
  "high": 5,
  "medium": 8,
  "low": 12
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `total` | Integer | Total reports |
| `high` | Integer | High severity count |
| `medium` | Integer | Medium severity count |
| `low` | Integer | Low severity count |

---

## Error Codes

| Code | Message | Cause |
|------|---------|-------|
| 200 | OK | Request successful |
| 400 | Bad Request | Missing required fields or invalid data |
| 500 | Internal Server Error | Backend processing error |

---

## Severity Levels

### High Priority
- **Size:** > 40,000 pixels
- **Priority Score:** 70-100
- **Color:** Red 🔴
- **Action:** Urgent repairs needed

### Medium Priority
- **Size:** 20,000 - 40,000 pixels
- **Priority Score:** 40-70
- **Color:** Yellow 🟡
- **Action:** Schedule repairs

### Low Priority
- **Size:** < 20,000 pixels
- **Priority Score:** 0-40
- **Color:** Green 🟢
- **Action:** Monitor, plan future repairs

---

## Frontend Integration Examples

### JavaScript (Fetch API)

#### Detect Pothole
```javascript
const file = document.getElementById('imageInput').files[0];
const formData = new FormData();
formData.append('image', file);
formData.append('latitude', 37.7749);
formData.append('longitude', -122.4194);

const response = await fetch('http://localhost:5000/detect', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(data.severity_level);
console.log(data.priority_score);
```

#### Get All Reports
```javascript
const response = await fetch('http://localhost:5000/reports');
const reports = await response.json();
console.log(reports); // Array of all reports
```

#### Get Statistics
```javascript
const response = await fetch('http://localhost:5000/reports/stats');
const stats = await response.json();
console.log(`Total: ${stats.total}, High: ${stats.high}`);
```

### Axios (Used in Frontend)

```javascript
import axios from 'axios';

// Detect
const formData = new FormData();
formData.append('image', imageFile);
formData.append('latitude', 37.7749);

const result = await axios.post('http://localhost:5000/detect', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// Fetch reports
const reports = await axios.get('http://localhost:5000/reports');
```

---

## CORS Configuration

The backend allows requests from:
- `http://localhost:3000` (development)
- `*` (for hackathon, but lock down in production)

To restrict CORS in production, modify `app.py`:
```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://yourdomain.com"]
    }
})
```

---

## Rate Limiting (Future Feature)

Currently unlimited. For production, consider:
- 100 detection requests per hour per IP
- 1000 report fetches per day

---

## Database Schema

### road_reports Table

```sql
CREATE TABLE public.road_reports (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT,
  severity_level VARCHAR(50) NOT NULL,
  priority_score INTEGER,
  latitude DECIMAL(10, 6),
  longitude DECIMAL(10, 6),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_severity ON public.road_reports(severity_level);
CREATE INDEX idx_timestamp ON public.road_reports(timestamp DESC);
```

---

## Testing Endpoints

### Using Postman

1. **Create new request → POST**
2. **URL:** `http://localhost:5000/detect`
3. **Body → form-data**
   - Key: `image`, Type: File, Value: [select your image]
   - Key: `latitude`, Type: Text, Value: `37.7749`
   - Key: `longitude`, Type: Text, Value: `-122.4194`
4. **Send**

### Using Thunder Client (VS Code)

Similar to Postman, set headers and form-data.

---

## Response Times

Typical response times:

| Endpoint | Time | Notes |
|----------|------|-------|
| `/health` | < 10ms | Always fast |
| `/detect` | 1-2 sec | Depends on image size |
| `/reports` | 50-200ms | Depends on record count |
| `/reports/stats` | 20-50ms | Fast aggregation |

---

## Common Integration Issues

### Issue: CORS Error
**Solution:** Backend runs with `CORS(app)` enabled. Check browser console.

### Issue: 400 Bad Request
**Solution:** Ensure:
- Image file is actually provided
- Latitude/longitude are numbers (if provided)
- Content-Type is multipart/form-data

### Issue: Timeout
**Solution:**
- Check image size (resize if > 5MB)
- Ensure backend is running
- Check network connectivity

---

## Backend Environment Variables

Required in `.env`:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

---

## Future API Enhancements

- [ ] `/reports/{id}` - Get specific report
- [ ] `/reports/delete/{id}` - Delete report
- [ ] `/reports/batch` - Upload multiple
- [ ] `/detect/stream` - Real-time video processing
- [ ] `/reports/heatmap` - Geographic heatmap data
- [ ] `/auth/login` - User authentication
- [ ] `/repairs/schedule` - Schedule repair crews

---

## Support

For API issues:
1. Check backend is running: `curl localhost:5000/health`
2. Verify SUPABASE_URL and SUPABASE_KEY in `.env`
3. Check browser console for errors
4. Review backend terminal for Python errors

---

**Last Updated:** March 4, 2024  
**Version:** 1.0  
**Status:** Production Ready for Hackathon
