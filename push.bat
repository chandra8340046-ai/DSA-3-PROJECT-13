@echo off
echo ====================================================================
echo Pushing Suffix Array Search Engine to GitHub Repository
echo Target: https://github.com/chandra8340046-ai/DSA-PROJECT-13.git
echo ====================================================================
echo.

"C:\Users\navan\AppData\Local\Programs\Git\cmd\git.exe" remote set-url origin https://github.com/chandra8340046-ai/DSA-PROJECT-13.git
"C:\Users\navan\AppData\Local\Programs\Git\cmd\git.exe" push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ====================================================================
    echo [TIP] If Git asks you to sign in, choose "Sign in with your browser"
    echo and make sure you sign into the chandra8340046-ai GitHub account.
    echo.
    echo Alternatively, add navaneeth5642-dot as a collaborator here:
    echo https://github.com/chandra8340046-ai/DSA-PROJECT-13/settings/access
    echo ====================================================================
) else (
    echo.
    echo ====================================================================
    echo [SUCCESS] Pushed successfully to https://github.com/chandra8340046-ai/DSA-PROJECT-13
    echo ====================================================================
)

pause
