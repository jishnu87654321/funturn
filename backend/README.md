# Funtern Backend Setup & API Guide

This is a production-ready Node.js & Express backend for the Funtern platform, providing robust application submission with file upload (resume), duplicate detection, rate limiting, centralized error handling, and category management.

## 🛠 Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

## 🚀 Getting Started

1. **Navigate to the Backend Directory:**
   ```bash
   cd d:/funtrun-2/backend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```
   > *Packages included: `express`, `mongoose`, `multer`, `express-validator`, `express-rate-limit`, `helmet`, `cors`, `uuid`, etc.*

3. **Database Setup:**
   Ensure MongoDB is running locally on port 27017, or configure `MONGODB_URI` in `backend/.env` with your remote cluster string.

4. **Seed the Categories:**
   Populate the database with the required Funtern opportunity categories.
   ```bash
   npm run seed
   ```

5. **Start the Server:**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```
   The backend will start on `http://localhost:5000`

---

## 🔗 API Endpoints Overview

### Categories
Fetches active opportunity types (Bootcamps, Workshops, etc.). Should be used by the frontend to render the Opportunity Cards grid.

- `GET /api/categories` - Fetch all active categories
- `GET /api/categories/:slug` - Fetch a category by its slug

### Applications (Registration Flow)
Handles student applications, including validation and multi-part file uploads using `multer`.

- `POST /api/applications` - Submit a new application.
  - **Content-Type:** `multipart/form-data`
  - **Required Fields:** `fullName`, `phoneNumber`, `qualification`, `email`, `selectedCategory` (MongoDB ID mapping to the specific program type)
  - **Required File:** `resume` (PDF, DOC, DOCX up to max size allowed in `.env`)
  
  *Features:*
  - Strict upload validation (MIME types & extensions using multer filter).
  - Validation checks for email formats, required missing data.
  - Rate limiting (max 10 submissions per 15 mins).
  - Duplicate email + category protection within 24-hours.
  - Auto-cleans failed uploads on bad requests.

### Admin Tools
These endpoints are structured to integrate seamlessly into a future admin dashboard.

- `GET /api/applications` - List applications (supports query filters: `?category=OBJ_ID&status=new&search=term&page=1&limit=20`)
- `GET /api/applications/:id` - View single application details
- `PATCH /api/applications/:id/status` - Update application review status (`status: "new" | "reviewed" | "shortlisted" | "rejected"`)

---

## 🎨 Backend UX Integration (For Frontend)

The API relies on standardized JSON responses so your frontend can handle errors gracefully.

### Success Format:
```json
{
  "success": true,
  "message": "Application submitted successfully! We will get back to you soon. 🎉",
  "data": { ... }
}
```

### Validation Error Format (maps easily to UI form field errors):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "phoneNumber": "Valid phone number is required",
    "selectedCategory": "Please select an opportunity category",
    "resume": "Unsupported file type. Please upload a PDF, DOC, or DOCX file."
  }
}
```

### System / Duplicate Error Format:
```json
{
  "success": false,
  "message": "You have already applied for this opportunity recently. Please wait before reapplying."
}
```
