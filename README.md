# ⚡ snip.ly — TinyURL Clone (MERN Stack)

A full-stack URL shortener with JWT auth, custom codes, QR generation, and 10 URLs/day limit.

---

## 🗂️ Project Structure

```
tinyurl-clone/
├── server/         → Express + MongoDB backend
├── client/         → React frontend
└── package.json    → Root runner
```

---

## 🚀 Quick Setup

### 1. Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### 2. Install Dependencies
```bash
# Install everything at once
npm install
npm run install-all
```

### 3. Configure Backend Environment
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/tinyurl
JWT_SECRET=your_super_secret_key_here
BASE_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000
```

> For MongoDB Atlas, replace MONGO_URI with your Atlas connection string.

### 4. Run the App

**Option A – Run both together (recommended):**
```bash
npm run dev
```

**Option B – Run separately:**
```bash
# Terminal 1 — Backend
npm run server

# Terminal 2 — Frontend
npm run client
```

### 5. Open in Browser
- Frontend → http://localhost:3000
- Backend API → http://localhost:5000

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login + get JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| POST | `/api/url/shorten` | ✅ | Shorten a URL |
| GET | `/api/url/my-urls` | ✅ | Get all user URLs |
| DELETE | `/api/url/:id` | ✅ | Delete a URL |
| GET | `/:shortCode` | ❌ | Redirect to original |

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register/login
- 🔗 **URL Shortening** — 6-char random codes via nanoid
- ✏️ **Custom Short Codes** — Set your own alias (3–20 chars)
- 📊 **10 URLs/Day Limit** — Per user, resets at midnight
- 📱 **QR Code Generation** — Downloadable PNG per URL
- 📈 **Click Tracking** — Count visits per short URL
- 📋 **Copy to Clipboard** — One-click copy

---

## 🌐 Deployment Tips

**Backend → Render.com**
1. Push to GitHub
2. Create new Web Service on Render
3. Set root directory to `server`
4. Add all `.env` variables in Render dashboard
5. Change `BASE_URL` to your Render URL

**Frontend → Vercel**
1. Import GitHub repo on Vercel
2. Set root directory to `client`
3. Add env: `REACT_APP_API_URL=https://your-render-url.com`
4. Update `client/src/api/index.js` baseURL to use `process.env.REACT_APP_API_URL`

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| URL gen | nanoid |
| QR Code | qrcode |
| Styling | Custom CSS (DM Mono + Syne fonts) |
