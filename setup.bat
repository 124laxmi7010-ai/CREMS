@echo off
setlocal

echo ==========================================
echo        CREMS PROJECT SETUP
echo ==========================================
echo.

echo Checking Node.js...
call node --version

echo.
echo Checking npm...
call npm --version

echo.
echo Node.js and npm are ready.
echo.

if exist "frontend" (
    echo ERROR: A frontend folder already exists.
    echo Please remove it before running this setup.
    pause
    exit /b 1
)

echo ==========================================
echo Creating React + Vite frontend
echo ==========================================
echo.

call npm.cmd create vite@latest frontend -- --template react

if not exist "frontend" (
    echo.
    echo ERROR: Frontend project was not created.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo Installing dependencies
echo ==========================================
echo.

cd frontend

call npm.cmd install

echo.
echo ==========================================
echo Installing React Router
echo ==========================================
echo.

call npm.cmd install react-router-dom

echo.
echo ==========================================
echo Creating CREMS folders
echo ==========================================
echo.

mkdir "src\assets" 2>nul
mkdir "src\components" 2>nul
mkdir "src\pages" 2>nul
mkdir "src\layouts" 2>nul
mkdir "src\services" 2>nul
mkdir "src\data" 2>nul

cd ..

echo.
echo ==========================================
echo       CREMS SETUP COMPLETED
echo ==========================================
echo.

echo Created:
echo.
echo frontend\
echo backend\
echo database\
echo.

echo NOTE: Backend and database folders will be
echo created separately when we start those parts.
echo.

pause
endlocal