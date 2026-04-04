# Nettoyage de la console
Clear-Host
Write-Host "--- Demarrage de la mise a jour Freelink (Debug & Release) ---" -ForegroundColor Cyan

# 1. Copie des fichiers web
Write-Host "[1/4] Preparation des fichiers web..." -ForegroundColor Yellow
if (!(Test-Path "www")) { New-Item -ItemType Directory -Path "www" }
copy index.html www/

# 2. Synchronisation Capacitor
Write-Host "[2/4] Synchronisation Capacitor vers Android..." -ForegroundColor Yellow
npx cap copy android
npx cap sync android

# 3. Nettoyage et Compilation
Write-Host "[3/4] Nettoyage des anciens builds..." -ForegroundColor Yellow
# On entre dans le dossier android pour lancer le batch gradlew.bat
cmd /c "cd android && gradlew clean"

Write-Host "[4/4] Compilation des APKs..." -ForegroundColor Yellow

# Compilation de la version DEBUG
Write-Host "> Generation de la version DEBUG..." -ForegroundColor Gray
cmd /c "cd android && gradlew assembleDebug"

# Compilation de la version RELEASE
Write-Host "> Generation de la version RELEASE (Optimisee)..." -ForegroundColor Gray
cmd /c "cd android && gradlew assembleRelease"

# Verification du resultat final
if ($? -eq $true) {
    Write-Host ""
    Write-Host "==============================================" -ForegroundColor Green
    Write-Host "   SUCCES ! Les deux versions sont prêtes.    " -ForegroundColor Green
    Write-Host "==============================================" -ForegroundColor Green
    
    Write-Host "Ouverture des dossiers..."
    # Ouvre le dossier Debug
    explorer.exe "android\app\build\outputs\apk\debug\"
    # Ouvre le dossier Release
    explorer.exe "android\app\build\outputs\apk\release\"
} else {
    Write-Host ""
    Write-Host "ERREUR : La compilation a echoue. Verifie les messages ci-dessus." -ForegroundColor Red
}