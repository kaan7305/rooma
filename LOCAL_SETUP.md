# 🏠 Local Development Setup Guide

## Quick Start

### Option 1: Automated Script (Recommended)

```bash
# Start both servers
./start-local.sh

# Stop both servers
./stop-local.sh
```

### Option 2: Manual Start

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

## 📍 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health
- **API Documentation**: http://localhost:5000

## ✅ Prerequisites

1. **Node.js** (v18 or higher)
   ```bash
   node --version
   ```

2. **npm** (comes with Node.js)
   ```bash
   npm --version
   ```

3. **Dependencies Installed**
   - Backend: Already installed ✅
   - Frontend: Already installed ✅

## 🔧 Configuration

### Backend Environment (.env)
Located at: `backend/.env`

Required variables:
```env
SUPABASE_URL=https://hfygradcovgih.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_NwetXHqIUvb-qDw5BlxNMA_yDX0feyR
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

### Frontend Environment (.env.local)
Located at: `frontend/.env.local`

Already configured:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=NestQuarter
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🧪 Testing

### 1. Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "environment": "development"
}
```

### 2. Test API Endpoint
```bash
curl http://localhost:5000/
```

### 3. Test Frontend
Open browser: http://localhost:3000

## 🐛 Troubleshooting

### Port Already in Use

**Backend (Port 5000):**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm run dev
```

**Frontend (Port 3000):**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Backend Won't Start

1. Check if `.env` file exists in `backend/` directory
2. Verify Supabase credentials
3. Check logs: `tail -f backend.log` (if using script)

### Frontend Can't Connect to Backend

1. Verify backend is running on port 5000
2. Check `frontend/.env.local` has correct API URL
3. Check browser console for CORS errors

### Dependencies Missing

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

## 📝 Development Workflow

1. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```

3. **Make Changes**
   - Backend: Auto-reloads on save
   - Frontend: Hot reloads on save

4. **View Logs**
   - Backend: Terminal 1
   - Frontend: Terminal 2 or browser console

## 🎯 Next Steps

1. ✅ Both servers running
2. ✅ Test health endpoint
3. ✅ Open frontend in browser
4. ✅ Test user registration
5. ✅ Test user login

## 📚 Additional Resources

- Backend API Docs: http://localhost:5000
- Frontend README: `frontend/FRONTEND-README.md`
- Backend README: `backend/README.md`

