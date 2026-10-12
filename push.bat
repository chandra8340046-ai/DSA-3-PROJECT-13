@echo off
echo ====================================================================
echo Pushing Suffix Array Search Engine to GitHub Repository
echo Target: https://github.com/navaneeth5642-dot/DSA-3.git
echo ====================================================================
echo.

"C:\Users\navan\AppData\Local\Programs\Git\cmd\git.exe" push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ====================================================================
    echo [ERROR] Push failed. Please check your internet connection or git status.
    echo ====================================================================
) else (
    echo.
    echo ====================================================================
    echo [SUCCESS] Pushed successfully to https://github.com/navaneeth5642-dot/DSA-3
    echo ====================================================================
)

pause
