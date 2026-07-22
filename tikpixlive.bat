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

:: Start ngrok saving its log
start "ngrok" /min cmd /c "ngrok http 3001 > %temp%\ngrok_log.txt 2>&1"

:: Wait for ngrok to connect
timeout /t 5 /nobreak >nul

:: Extract the public URL from ngrok's local API
set NGROK_URL=
for /f "tokens=*" %%a in ('powershell -Command "try { $r = Invoke-RestMethod -Uri 'http://127.0.0.1:4040/api/tunnels' -ErrorAction Stop; $r.tunnels[0].public_url } catch { echo '' }"') do set NGROK_URL=%%a

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
if not "%NGROK_URL%"=="" (
  echo  CELULAR (WiFi/4G):
  echo    %NGROK_URL%/#/nubank
  start %NGROK_URL%/#/nubank
) else (
  echo  ngrok: aguardando conexao...
  echo  Veja a janela "ngrok" para o link
)
echo.
echo ============================================
echo  Pressione ENTER para parar tudo
echo.

pause >nul

:: Kill everything
taskkill /fi "windowtitle eq ngrok" /f >nul 2>&1
taskkill /fi "windowtitle eq TikPix API" /f >nul 2>&1
