@echo off
title TikPix Live

cd /d "%~dp0"

echo [1/2] Building...
call pnpm build

echo [2/2] Starting server on port 3001...

:: Start the server in a minimized window
start "TikPix API" /min node server.js

:: Wait for server
timeout /t 3 /nobreak >nul

:: Start ngrok (output visible so user sees URL)
start "ngrok" /min ngrok http 3001

:: Wait and retry to get ngrok URL
set NGROK_URL=
for /l %%i in (1,1,5) do (
  if not defined NGROK_URL (
    for /f "tokens=*" %%a in ('powershell -Command "try { $r = Invoke-RestMethod -Uri 'http://127.0.0.1:4040/api/tunnels' -ErrorAction Stop; $r.tunnels[0].public_url } catch { echo '' }"') do set NGROK_URL=%%a
    if not defined NGROK_URL timeout /t 2 /nobreak >nul
  )
)

:: Open local pages
start http://localhost:3001
start http://localhost:3001/#/nubank

cls
echo ============================================
echo   TikPix Live - rodando!
echo ============================================
echo.
echo  PC:
echo    Main:     http://localhost:3001
echo    Nubank:   http://localhost:3001/#/nubank
echo.
set URL_FILE=%USERPROFILE%\Desktop\tikpix_url.txt
if not "%NGROK_URL%"=="" (
  echo  CELULAR (WiFi/4G):
  echo    %NGROK_URL%/#/nubank
  start %NGROK_URL%/#/nubank
  echo %NGROK_URL%/#/nubank > "%URL_FILE%"
  echo  URL salva em: %URL_FILE%
) else (
  echo  ngrok: URL nao detectada - veja a janela do ngrok
)
echo.
echo ============================================
echo  Pressione ENTER para parar tudo
echo.

pause >nul

:: Kill everything
taskkill /fi "windowtitle eq ngrok" /f >nul 2>&1
taskkill /fi "windowtitle eq TikPix API" /f >nul 2>&1
