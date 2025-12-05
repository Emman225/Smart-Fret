@echo off
echo ========================================
echo   Test API Locale - Smart Fret
echo ========================================
echo.

echo [1/3] Test API de base...
curl -s http://127.0.0.1:8001/api/type-dossiers
echo.
echo.

echo [2/3] Test Proxy Login (avec identifiants)...
curl -X POST http://127.0.0.1:8001/api/proxy/login ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json" ^
  -d "{\"LoginUser\":\"A\",\"PwdUser\":\"123\"}"
echo.
echo.

echo [3/3] Verification des routes Laravel...
echo Executez manuellement: php artisan route:list | grep proxy
echo.

echo ========================================
echo   Tests Termines
echo ========================================
echo.
echo Si vous voyez du JSON (et non du HTML), c'est bon!
echo Si erreur 404: la route proxy n'existe pas encore
echo Si erreur 500: verifiez les logs Laravel
echo.

pause
