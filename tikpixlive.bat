@echo off
title TikPix Live

cd /d "%~dp0"

echo [1/2] Building...
call pnpm build

echo [2/2] Starting server on port 3001...
echo.
echo Main app:     http://localhost:3001
echo Nubank page:  http://localhost:3001/#/nubank
echo.
echo Para acessar do celular, use ngrok:
echo   1. Abra outro terminal e execute: ngrok http 3001
echo   2. Cole o link https gerado no celular
echo.
echo Pressione CTRL+C para parar o servidor
echo.

node server.js
pause
