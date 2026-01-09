# ⚡ Quick Start - Host Project Locally

## 🚀 Start Everything (Easiest Way)

```bash
cd /Users/erkanuysal/Desktop/subletting
./start-local.sh
```

This will start:
- ✅ Backend on http://localhost:5000
- ✅ Frontend on http://localhost:3000

## 🛑 Stop Everything

```bash
./stop-local.sh
```

## 📍 Access Your Application

- **Frontend (Web App)**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## 🔧 Manual Start (Alternative)

If the script doesn't work, start manually:

### Terminal 1 - Backend
```bash
cd /Users/erkanuysal/Desktop/subletting/backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd /Users/erkanuysal/Desktop/subletting/frontend
npm run dev
```

## ✅ Verify It's Working

1. **Check Backend:**
   ```bash
   curl http://localhost:5000/health
   ```
   Should return: `{"status":"ok",...}`

2. **Check Frontend:**
   - Open browser: http://localhost:3000
   - You should see the NestQuarter homepage

## 🐛 Common Issues

### "Port already in use"
```bash
# Kill processes on ports
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### "Command not found: ./start-local.sh"
```bash
chmod +x start-local.sh stop-local.sh
```

### Frontend can't connect to backend
- Make sure backend is running on port 5000
- Check `frontend/.env.local` exists and has correct API URL

## 📚 More Details

See `LOCAL_SETUP.md` for detailed documentation.

