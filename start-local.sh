#!/bin/bash

# Local Development Startup Script
# This script starts both backend and frontend servers

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting NestQuarter Local Development Environment${NC}"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version:$(node --version)${NC}"
echo ""

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

# Check backend port
if check_port 5000; then
    echo -e "${YELLOW}⚠️  Port 5000 is already in use. Backend might already be running.${NC}"
else
    echo -e "${GREEN}📦 Starting Backend Server (Port 5000)...${NC}"
    cd backend
    npm run dev > ../backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../backend.pid
    cd ..
    echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
    echo "   Logs: tail -f backend.log"
    sleep 3
fi

# Check frontend port
if check_port 3000; then
    echo -e "${YELLOW}⚠️  Port 3000 is already in use. Frontend might already be running.${NC}"
else
    echo -e "${GREEN}📦 Starting Frontend Server (Port 3000)...${NC}"
    cd frontend
    npm run dev > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../frontend.pid
    cd ..
    echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
    echo "   Logs: tail -f frontend.log"
    sleep 3
fi

echo ""
echo "=========================================="
echo -e "${GREEN}✨ Development servers are starting!${NC}"
echo ""
echo "📍 Backend API:  http://localhost:5000"
echo "📍 Frontend App: http://localhost:3000"
echo ""
echo "📝 View logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🛑 To stop servers:"
echo "   ./stop-local.sh"
echo "   or kill the processes manually"
echo ""

