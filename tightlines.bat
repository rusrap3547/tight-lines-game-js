@echo off
setlocal

REM Double-click launcher for end users.
REM Tries common packaged locations and starts Tight Lines.

set "DIR=%~dp0"

set "CANDIDATE1=%DIR%tightlines.exe"
set "CANDIDATE2=%DIR%release\tightlines\tightlines.exe"
set "CANDIDATE3=%DIR%src-tauri\target\release\tightlines.exe"
set "CANDIDATE4=%DIR%src-tauri\target\release\app.exe"

if exist "%CANDIDATE1%" (
    start "" "%CANDIDATE1%"
    exit /b 0
)

if exist "%CANDIDATE2%" (
    start "" "%CANDIDATE2%"
    exit /b 0
)

if exist "%CANDIDATE3%" (
    start "" "%CANDIDATE3%"
    exit /b 0
)

if exist "%CANDIDATE4%" (
    start "" "%CANDIDATE4%"
    exit /b 0
)

echo Could not find tightlines.exe.
echo.
echo Expected one of:
echo   %CANDIDATE1%
echo   %CANDIDATE2%
echo.
echo If you are the developer, build package first:
echo   npm run package:win
echo.
pause
exit /b 1
