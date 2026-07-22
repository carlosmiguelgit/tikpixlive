@echo off
title TikPix Live

cd /d "%~dp0"

echo [1/2] Building...
call pnpm build

echo [2/2] Starting server on port 3001...

:: Start the server in a minimized window
start "TikPix API" /min node server.js

:: Wait for server to start
timeout /t 3 /nobreak >nul

:: Start ngrok tunnel in a minimized window
start "ngrok" /min cmd /c "ngrok http 3001 --log=stdout"

:: Wait for ngrok to connect
timeout /t 4 /nobreak >nul

:: Open both pages in the default browser
start http://localhost:3001
start http://localhost:3001/#/nubank

echo.
echo ============================================
echo  Main app:     http://localhost:3001
echo  Nubank page:  http://localhost:3001/#/nubank
echo ============================================
echo.
echo  No celular, abra:
echo  https://abc123.ngrok-free.app/#/nubank
echo.
echo  (veja o link exato na janela "ngrok" que abriu)
echo.
echo Pressione ENTER para parar tudo
echo.
pause >nul

:: Kill ngrok and the server
taskkill /fi "windowtitle eq ngrok" /f >nul 2>&1
taskkill /fi "windowtitle eq TikPix API" /f >nul 2>&1
