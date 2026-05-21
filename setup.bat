@echo off
REM Check for admin privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo This script must be run as administrator.
    echo Requesting admin privileges...
    powershell -Command "Start-Process cmd -ArgumentList '/c, %~0' -Verb RunAs"
    exit /b
)

REM Run the npm package command
echo Running: npm run package:win
npm run package:win

if %errorLevel% neq 0 (
    echo.
    echo Error: npm run package:win failed.
    pause
    exit /b 1
)

echo.
echo Success! Packaging completed.
pause
