@echo off
REM RoadGuard AI - Quick Start Script for Windows
REM Automates setup and launches the application

echo.
echo RoadGuard AI - Quick Start
echo ==========================
echo.

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python not found. Please install Python 3.8+
    pause
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found. Please install Node.js 18+
    pause
    exit /b 1
)

echo OK: Python and Node.js found
echo.

REM Setup Backend
echo Setting up backend...
cd backend

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo WARNING: Please edit backend\.env with your Supabase credentials
)

echo Installing dependencies...
pip install -q -r requirements.txt

echo OK: Backend ready
echo.

REM Setup Frontend
echo Setting up frontend...
cd ..\frontend

if not exist ".env.local" (
    echo Creating .env.local file...
    copy .env.example .env.local
    echo WARNING: Please edit frontend\.env.local with your Supabase credentials
)

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install -q
)

echo OK: Frontend ready
echo.

echo ========================================
echo RoadGuard AI is ready to launch!
echo ========================================
echo.
echo Next steps:
echo 1. Edit backend\.env with Supabase credentials
echo 2. Edit frontend\.env.local with Supabase credentials
echo 3. Run: npm run dev (in frontend directory)
echo 4. In another terminal: python app.py (in backend directory)
echo 5. Open http://localhost:3000 in browser
echo.
echo For detailed setup, see SETUP.md
echo.
pause
