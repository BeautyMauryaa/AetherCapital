# 🚀 Aether Capital

Aether Capital is a modern full-stack onboarding and compliance management platform built to streamline customer verification, risk assessment, and document validation workflows for individuals, businesses, and enterprise clients.

The platform delivers a complete KYC/KYB-style experience with AI-driven risk scoring, secure document handling, and a powerful admin review system.

---

## ✨ Features

### 👤 Multi-Type Account Onboarding

Supports three onboarding flows — each dynamically adapts fields and compliance requirements:

- Individual Accounts
- Business Accounts
- Enterprise Accounts

Includes multi-step forms, secure file uploads, digital signature capture, and operating hours management for businesses.

---

### 📄 Document Management System

Users can upload:
- Profile Images
- Government IDs (Front & Back)
- Business Certificates
- Tax Documents
- Compliance Documents
- Proof of Address
- Supporting Files

Features:
- Google Drive cloud storage integration
- Independent document approval/rejection per file
- Document status tracking
- Admin verification workflow

---

### 🛡️ AI Risk Scoring Engine

Automated dynamic risk analysis based on:
- Account type & user roles
- 2FA configuration
- Compliance questionnaire responses
- Country risk & regulatory exposure
- Crypto/payment activities
- Sanctioned regions & cross-border storage

**Risk Levels:** Low · Medium · High

---

### 📊 Admin Dashboard

- Submission analytics & trend charts
- Approval/rejection management
- Search by Reference Number, MongoDB ID, Name, Email, or Company
- Filter by Status, Risk Level, and Account Type
- Risk distribution graphs
- Account type breakdown
- Recent activity tracking

Built with **Recharts + Material UI**.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React.js, Vite, Material UI, Tailwind CSS, Zustand, Recharts |
| Backend | Node.js, Express.js, MongoDB, Mongoose, Multer |
| Cloud & Storage | Google Drive API, Render |

---

## 📂 Project Structure

```bash
AetherCapital/
│
├── Admin-panel/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── layouts/
|
│├── client/
|   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── layouts/
|
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── config/
│
└── README.md
```

---

## ⚙️ Installation

###  Clone Repository

```bash
git clone https://github.com/your-username/AetherCapital.git
```

### 1️⃣ Backend Setup

```bash
cd server
npm install
node server.js 
```
### 2️⃣ client(Aether capital) Setup

```bash
cd client
npm install
npm run dev
```


### 3️⃣ Admin-panel Setup

```bash
cd Admin-panel
npm install
npm run dev
```

---

## 🔐 Environment Variables

### Backend `.env`

```env
PORT=8000
MONGODB_URI=your_mongodb_uri

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
GOOGLE_DRIVE_FOLDER_ID=your_folder_id

FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:8000/api
```

---

## 📦 API Endpoints

### Onboarding

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/onboarding/submit` | Submit onboarding |
| GET | `/api/onboarding` | Get all onboardings |
| GET | `/api/onboarding/:id` | Get single onboarding |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/submissions` | Get all submissions |
| GET | `/api/admin/submissions/:id` | Get single submission |
| PATCH | `/api/admin/submissions/:id/status` | Update submission status |
| GET | `/api/admin/documents` | Get all documents |
| PATCH | `/api/admin/submissions/:id/document-status` | Update document status |

---

## 🧠 Risk Scoring Logic

Risk score is computed dynamically based on:
- Account type and sensitive role assignments
- Regulatory exposure and PII handling
- Payment processing and crypto usage
- Sanctioned regions and cross-border data storage
- High-risk country classification

---

## 📸 Screenshots

```md
![Dashboard](./screenshots/dashboard.png)
![Documents](./screenshots/documents.png)
![Analytics](./screenshots/analytics.png)
```

## 🚀 Deployment

- **Frontend & Backend** → Render
- **Database** → MongoDB Atlas
- **Storage** → Google Drive API

---

## 👩‍💻 Developed By

**Nova (Beauty)**
Full Stack Developer focused on building scalable, AI-driven, and compliance-oriented web platforms.
