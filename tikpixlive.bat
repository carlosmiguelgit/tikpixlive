@echo off
title TikPix Live

cd /d "%~dp0"

echo [1/2] Building...
call pnpm build

echo [2/2] Starting server on port 3001...

:: Start server and save its PID
start "TikPix API" /min cmd /c "node server.js && echo SERVER_DONE > %temp%\tikpix_done.txt"

:: Wait for server to start
timeout /t 3 /nobreak >nul

:: Find the server PID
for /f "tokens=2" %%a in ('tasklist /fi "windowtitle eq TikPix API" /nh') do set SERVER_PID=%%a

:: Open both pages in the default browser
start http://localhost:3001
start http://localhost:3001/#/nubank

echo.
echo ============================================
echo  Main app:     http://localhost:3001
echo  Nubank page:  http://localhost:3001/#/nubank
echo ============================================
echo.
echo Para acessar do celular, use ngrok:
echo   1. Abra outro terminal e: ngrok http 3001
echo   2. Cole o link gerado no celular
echo.
echo Pressione ENTER para parar o servidor
echo.
pause >nul

:: Kill only our server process
if not "%SERVER_PID%"=="" (
  taskkill /pid %SERVER_PID% /f >nul 2>&1
)
