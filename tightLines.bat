@echo off
setlocal

REM Root launcher for packaged Windows app.
REM Double-click this file to start Tight Lines.

set "SCRIPT_DIR=%~dp0"
set "SEARCH1=%SCRIPT_DIR%"
set "SEARCH2=%SCRIPT_DIR%release\"
set "SEARCH3=%SCRIPT_DIR%..\"
set "SEARCH4=%SCRIPT_DIR%..\release\"

REM Prefer explicit unpacked app paths.
for %%D in ("%SEARCH1%" "%SEARCH2%" "%SEARCH3%" "%SEARCH4%") do (
    if exist "%%~fDwin-unpacked\Tight Lines.exe" (
        start "" "%%~fDwin-unpacked\Tight Lines.exe"
        exit /b 0
    )
    if exist "%%~fDwin-arm64-unpacked\Tight Lines.exe" (
        start "" "%%~fDwin-arm64-unpacked\Tight Lines.exe"
        exit /b 0
    )
)

REM Portable target usually creates "Tight Lines <version>.exe" in release.
for %%D in ("%SEARCH1%" "%SEARCH2%" "%SEARCH3%" "%SEARCH4%") do (
    for %%F in ("%%~fDTight Lines*.exe") do (
        if exist "%%~fF" (
            start "" "%%~fF"
            exit /b 0
        )
    )
)

REM Last-resort recursive search across nearby locations.
for %%D in ("%SEARCH1%" "%SEARCH2%" "%SEARCH3%" "%SEARCH4%") do (
    if exist "%%~fD" (
        for /r "%%~fD" %%F in (*.exe) do (
            if /i not "%%~nxF"=="elevate.exe" (
                if /i not "%%~nxF"=="unins000.exe" (
                    start "" "%%~fF"
                    exit /b 0
                )
            )
        )
    )
)

echo No packaged Windows app found near this launcher.
echo Searched:
echo   "%SEARCH1%"
echo   "%SEARCH2%"
echo   "%SEARCH3%"
echo   "%SEARCH4%"
echo Run this once from project root: npm run dist
pause
