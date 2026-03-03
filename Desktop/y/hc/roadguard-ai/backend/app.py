"""
RoadGuard AI - Smart Road Damage Detection Backend
Flask API for pothole detection using OpenCV
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
import io
import os
from datetime import datetime
from dotenv import load_dotenv
import requests

load_dotenv()

app = Flask(__name__)
CORS(app)

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-supabase-url.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "your-supabase-key")

# Upload folder
UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


def encode_image_to_base64(cv_image):
    """Convert OpenCV image to Base64 string"""
    _, buffer = cv2.imencode(".png", cv_image)
    return base64.b64encode(buffer).decode("utf-8")


def detect_potholes(image_path):
    """
    Detect potholes in road image using OpenCV edge detection.
    Returns: processed image, contours, severity level, priority score
    """
    # Read image
    img = cv2.imread(image_path)
    if img is None:
        return None, [], "Unknown", 0

    # Resize for processing
    img = cv2.resize(img, (800, 600))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Apply Gaussian blur to reduce noise
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Edge detection using Canny
    edges = cv2.Canny(blurred, 50, 150)

    # Dilate to connect edges
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    dilated = cv2.dilate(edges, kernel, iterations=2)

    # Find contours
    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Draw contours and calculate severity
    processed_img = img.copy()
    damage_areas = []

    for contour in contours:
        area = cv2.contourArea(contour)
        # Filter small noise
        if area > 500:
            x, y, w, h = cv2.boundingRect(contour)
            damage_areas.append({"x": x, "y": y, "w": w, "h": h, "area": area})
            # Draw bounding box (green to red based on area)
            intensity = min(255, int((area / 50000) * 255))
            color = (0, 255 - intensity, intensity)
            cv2.rectangle(processed_img, (x, y), (x + w, y + h), color, 3)
            cv2.putText(
                processed_img,
                f"Area: {int(area)}",
                (x, y - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                color,
                2,
            )

    # Calculate severity based on damage areas
    if not damage_areas:
        severity_level = "Low"
        priority_score = 10
    else:
        avg_area = np.mean([d["area"] for d in damage_areas])
        max_area = max([d["area"] for d in damage_areas])

        if max_area > 40000:
            severity_level = "High"
            priority_score = min(100, int((max_area / 50000) * 100))
        elif max_area > 20000:
            severity_level = "Medium"
            priority_score = min(100, int((max_area / 50000) * 75))
        else:
            severity_level = "Low"
            priority_score = min(100, int((max_area / 50000) * 50))

    return processed_img, damage_areas, severity_level, priority_score


def save_to_supabase(severity_level, priority_score, latitude, longitude, image_url):
    """Save detection report to Supabase"""
    try:
        headers = {
            "apikey": SUPABASE_KEY,
            "Content-Type": "application/json",
        }

        data = {
            "image_url": image_url,
            "severity_level": severity_level,
            "priority_score": priority_score,
            "latitude": latitude,
            "longitude": longitude,
            "timestamp": datetime.utcnow().isoformat(),
        }

        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/road_reports",
            json=data,
            headers=headers,
        )

        return response.status_code == 201
    except Exception as e:
        print(f"Error saving to Supabase: {e}")
        return False


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "RoadGuard AI Backend"}), 200


@app.route("/detect", methods=["POST"])
def detect():
    """
    Main pothole detection endpoint
    Expected input: image file, latitude, longitude
    """
    try:
        # Check if image is present
        if "image" not in request.files:
            return jsonify({"error": "No image provided"}), 400

        file = request.files["image"]
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        # Validate file size (max 5MB)
        max_size = 5 * 1024 * 1024  # 5MB in bytes
        if len(file.read()) > max_size:
            return jsonify({"error": "File size exceeds 5MB limit"}), 413
        file.seek(0)  # Reset file pointer after reading

        # Validate file type
        allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in allowed_extensions:
            return jsonify({"error": f"Invalid file format. Allowed: {', '.join(allowed_extensions)}"}), 400

        latitude = request.form.get("latitude", 0.0)
        longitude = request.form.get("longitude", 0.0)

        try:
            latitude = float(latitude)
            longitude = float(longitude)
            # Validate coordinate ranges
            if not (-90 <= latitude <= 90):
                return jsonify({"error": "Latitude must be between -90 and 90"}), 400
            if not (-180 <= longitude <= 180):
                return jsonify({"error": "Longitude must be between -180 and 180"}), 400
        except ValueError:
            return jsonify({"error": "Invalid latitude or longitude values"}), 400

        # Save uploaded file temporarily
        temp_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(temp_path)

        # Detect potholes
        processed_img, damage_areas, severity_level, priority_score = detect_potholes(
            temp_path
        )

        if processed_img is None:
            return jsonify({"error": "Could not process image"}), 400

        # Encode processed image to Base64
        processed_image_base64 = encode_image_to_base64(processed_img)

        # Create response
        response_data = {
            "processed_image": f"data:image/png;base64,{processed_image_base64}",
            "severity_level": severity_level,
            "priority_score": priority_score,
            "latitude": latitude,
            "longitude": longitude,
            "damage_count": len(damage_areas),
            "timestamp": datetime.now().isoformat(),
        }

        # Try to save to Supabase
        save_to_supabase(
            severity_level, priority_score, latitude, longitude, response_data["processed_image"]
        )

        # Clean up temp file
        os.remove(temp_path)

        return jsonify(response_data), 200

    except Exception as e:
        print(f"Error in detection: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/reports", methods=["GET"])
def get_reports():
    """Fetch all reports from Supabase"""
    try:
        headers = {
            "apikey": SUPABASE_KEY,
            "Content-Type": "application/json",
        }

        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/road_reports?order=timestamp.desc",
            headers=headers,
        )

        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({"error": "Could not fetch reports"}), response.status_code

    except Exception as e:
        print(f"Error fetching reports: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/reports/stats", methods=["GET"])
def get_stats():
    """Get statistics from all reports"""
    try:
        headers = {
            "apikey": SUPABASE_KEY,
            "Content-Type": "application/json",
        }

        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/road_reports",
            headers=headers,
        )

        if response.status_code == 200:
            reports = response.json()

            stats = {
                "total": len(reports),
                "high": len([r for r in reports if r["severity_level"] == "High"]),
                "medium": len([r for r in reports if r["severity_level"] == "Medium"]),
                "low": len([r for r in reports if r["severity_level"] == "Low"]),
            }

            return jsonify(stats), 200
        else:
            return jsonify({"error": "Could not fetch stats"}), response.status_code

    except Exception as e:
        print(f"Error getting stats: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
