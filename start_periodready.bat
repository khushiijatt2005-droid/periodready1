@echo off
title PeriodReady Web App
cls
echo ======================================================================
echo           PeriodReady - Full-Stack E-Commerce Platform
echo     "Be Ready. Feel Confident. Keep Going." - Menstrual Kits
echo ======================================================================
echo.
echo   [1] LAPTOP / WINDOWS BROWSER LINK:
echo       -> http://localhost:5000
echo.
echo   [2] MOBILE PHONE LINK (Connect to same Wi-Fi):
echo       -> http://192.168.0.109:5000
echo.
echo   [3] ADMIN DASHBOARD LINK:
echo       -> http://localhost:5000/admin
echo.
echo   DEMO CREDENTIALS:
echo   - Customer: customer@periodready.com / Customer@123
echo   - Admin:    admin@periodready.com    / Admin@123
echo.
echo ======================================================================
echo   Starting server now... (Press Ctrl+C to stop)
echo ======================================================================
echo.

cd /d "%~dp0"
node_runtime\node.exe server\server.js
pause
