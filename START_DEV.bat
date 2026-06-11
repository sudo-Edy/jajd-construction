@echo off
REM JAJD Construction - Development Server Startup Script
REM This script will start the Vite development server on localhost:3000

echo.
echo ====================================
echo JAJD Construction Dev Server
echo ====================================
echo.
echo Installing dependencies (if needed)...
call npm install

echo.
echo Starting development server...
echo.
echo The application will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause
