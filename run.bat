@echo off
echo ========================================================
echo Suffix Array & Kasai LCP Full-Text Search Engine
echo Team 3, Section 13 (DSA 3 Final Review)
echo ========================================================
echo.
echo Starting FastAPI Backend on http://localhost:8000 ...
start "Search Engine Backend (FastAPI)" cmd /k "python -m uvicorn main:app --app-dir backend --port 8000 --reload"

echo Starting Vite Frontend on http://localhost:5173 ...
start "Search Engine Frontend (Vite)" cmd /k "npm --prefix frontend run dev"

echo.
echo Both servers are launching in separate windows!
echo Frontend will be accessible at: http://localhost:5173
echo Backend API Docs at:           http://localhost:8000/docs
timeout /t 3 >nul
start http://localhost:5173
