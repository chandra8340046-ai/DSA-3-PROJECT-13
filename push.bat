@echo off
echo ====================================================================
echo Pushing Suffix Array Search Engine to GitHub Repository
echo Target: https://github.com/chandra8340046-ai/DSA-13--PRACTICAL.git
echo ====================================================================
echo.

"C:\Users\navan\AppData\Local\Programs\Git\cmd\git.exe" push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ====================================================================
    echo [PERMISSION ERROR 403]
    echo GitHub account 'navaneeth5642-dot' does not yet have write access
    echo to repository 'chandra8340046-ai/DSA-13--PRACTICAL'.
    echo.
    echo FIX:
    echo 1. Have chandra8340046-ai go to:
    echo    https://github.com/chandra8340046-ai/DSA-13--PRACTICAL/settings/access
    echo 2. Click "Add people" and invite: navaneeth5642-dot
    echo 3. Accept the invitation in your GitHub email/dashboard.
    echo 4. Run this script again!
    echo ====================================================================
) else (
    echo.
    echo ====================================================================
    echo [SUCCESS] Pushed successfully to GitHub!
    echo ====================================================================
)

pause
