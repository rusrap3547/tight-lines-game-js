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
@echo off
setlocal enableextensions

REM Elevate once because prerequisite installers typically need admin rights.
if /i not "%~1"=="__elevated" (
    net session >nul 2>&1
    if errorlevel 1 (
        echo Requesting administrator privileges to install prerequisites...
        powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -ArgumentList '__elevated' -Verb RunAs"
        exit /b
    )
)

REM Always run from this script's folder so paths/scripts resolve correctly.
pushd "%~dp0" >nul 2>&1
if errorlevel 1 (
    echo Error: Could not change directory to script location.
    pause
    exit /b 1
)

call :ensure_winget
if errorlevel 1 goto :fail

call :ensure_node
if errorlevel 1 goto :fail

call :ensure_rust
if errorlevel 1 goto :fail

call :ensure_msvc
if errorlevel 1 goto :fail

if not exist "node_modules\.bin\tauri.cmd" (
    echo Installing npm dependencies...
    call npm install
    if errorlevel 1 (
        echo.
        echo Error: npm install failed.
        goto :fail
    )
)

if not exist "node_modules\.bin\tauri.cmd" (
    echo Error: Tauri CLI was not found after npm install.
    goto :fail
)

echo Running: npm run package:win
call npm run package:win
if errorlevel 1 (
    echo.
    echo Error: npm run package:win failed.
    goto :fail
)

echo.
echo Success! Packaging completed.
popd
pause
exit /b 0

:ensure_winget
where winget >nul 2>&1
if errorlevel 1 (
    echo Error: winget was not found.
    echo Install App Installer from Microsoft Store and run setup again.
    exit /b 1
)
exit /b 0

:ensure_node
where npm >nul 2>&1
if errorlevel 1 (
    echo Node.js not found. Installing Node.js LTS with winget...
    winget install -e --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
    if errorlevel 1 (
        echo Primary Node.js package was not applicable. Trying alternate Node.js package...
        winget install -e --id OpenJS.NodeJS --accept-source-agreements --accept-package-agreements
        if errorlevel 1 (
            echo Error: Failed to install Node.js using winget.
            exit /b 1
        )
    )
)

REM Refresh common Node.js paths for this session.
if exist "%ProgramFiles%\nodejs\npm.cmd" set "PATH=%ProgramFiles%\nodejs;%PATH%"
if exist "%ProgramFiles(x86)%\nodejs\npm.cmd" set "PATH=%ProgramFiles(x86)%\nodejs;%PATH%"
if exist "%LOCALAPPDATA%\Programs\nodejs\npm.cmd" set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"

where npm >nul 2>&1
if errorlevel 1 (
    echo Error: npm is still unavailable after Node.js installation.
    exit /b 1
)
exit /b 0

:ensure_rust
where cargo >nul 2>&1
if errorlevel 1 (
    echo Rust/Cargo not found. Installing Rustup with winget...
    winget install -e --id Rustlang.Rustup --accept-source-agreements --accept-package-agreements
    if errorlevel 1 (
        echo Rustup winget package was not applicable. Trying alternate Rust package...
        winget install -e --id Rustlang.Rust.MSVC --accept-source-agreements --accept-package-agreements
        if errorlevel 1 (
            echo winget Rust install failed. Falling back to official rustup installer...
            powershell -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference='SilentlyContinue'; Invoke-WebRequest -Uri 'https://win.rustup.rs/x86_64' -OutFile \"$env:TEMP\\rustup-init.exe\""
            if errorlevel 1 (
                echo Error: Failed to download rustup installer.
                exit /b 1
            )
            "%TEMP%\rustup-init.exe" -y
            if errorlevel 1 (
                echo Error: rustup installer failed.
                exit /b 1
            )
        )
    )
)

REM Refresh common cargo path for this session.
if exist "%USERPROFILE%\.cargo\bin\cargo.exe" set "PATH=%USERPROFILE%\.cargo\bin;%PATH%"

where cargo >nul 2>&1
if errorlevel 1 (
    echo Error: cargo is still unavailable after Rust installation.
    echo Restart terminal and run setup again.
    exit /b 1
)
exit /b 0

:ensure_msvc
where cl >nul 2>&1
if not errorlevel 1 exit /b 0

echo Microsoft C++ Build Tools not found. Installing Visual Studio Build Tools...
winget install -e --id Microsoft.VisualStudio.2022.BuildTools --accept-source-agreements --accept-package-agreements --override "--quiet --wait --norestart --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"
if errorlevel 1 (
    echo Error: Failed to install Visual Studio Build Tools.
    exit /b 1
)

if exist "%ProgramFiles%\Microsoft Visual Studio\2022\BuildTools\Common7\Tools\VsDevCmd.bat" (
    call "%ProgramFiles%\Microsoft Visual Studio\2022\BuildTools\Common7\Tools\VsDevCmd.bat" -arch=x64 -host_arch=x64 >nul 2>&1
)
if exist "%ProgramFiles(x86)%\Microsoft Visual Studio\2022\BuildTools\Common7\Tools\VsDevCmd.bat" (
    call "%ProgramFiles(x86)%\Microsoft Visual Studio\2022\BuildTools\Common7\Tools\VsDevCmd.bat" -arch=x64 -host_arch=x64 >nul 2>&1
)

where cl >nul 2>&1
if errorlevel 1 (
    echo Error: Build tools were installed, but cl.exe is still unavailable.
    echo Restart your computer, then run setup.bat again.
    exit /b 1
)

echo Build tools installed and loaded.
exit /b 0

:fail
echo.
echo Setup failed.
popd
pause
exit /b 1
