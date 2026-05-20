@echo off
setlocal

REM Root launcher for packaged Windows app.
REM Double-click this file to start Tight Lines.

set "SCRIPT_DIR=%~dp0"
set "APP_X64=%SCRIPT_DIR%release\win-unpacked\Tight Lines.exe"
set "APP_ARM64=%SCRIPT_DIR%release\win-arm64-unpacked\Tight Lines.exe"

if exist "%APP_X64%" (
    start "" "%APP_X64%"
    exit /b 0
)

for %%F in ("%SCRIPT_DIR%release\Tight Lines*.exe") do (
    if exist "%%~fF" (
        start "" "%%~fF"
        exit /b 0
    )
)

if exist "%APP_ARM64%" (
    start "" "%APP_ARM64%"
    exit /b 0
)

echo No packaged Windows app found.
echo Run this once from project root: npm run dist
pause
