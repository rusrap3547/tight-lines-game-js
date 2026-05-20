@echo off
setlocal

REM Simplified launcher for Tight Lines game.
REM Double-click this file to start the game.

set "SCRIPT_DIR=%~dp0"
set "RELEASE_DIR=%SCRIPT_DIR%release"

REM Check if the game executable exists in the release folder
if exist "%RELEASE_DIR%\Tight Lines.exe" (
    start "" "%RELEASE_DIR%\Tight Lines.exe"
    exit /b 0
)

REM Error message if the executable is not found
echo Error: Could not find the game executable.
echo Please ensure the "release" folder contains "Tight Lines.exe".
pause
exit /b 1
