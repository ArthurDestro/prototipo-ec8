# Liga o servidor, abre o emulador Android e instala o app nele.
$env:JAVA_HOME = "$env:ProgramFiles\Android\Android Studio\jbr"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
Set-Location $PSScriptRoot
# A pasta android entra no PATH para o Capacitor achar o gradlew no Windows
$env:Path = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$PSScriptRoot\android;$env:Path"

# Servidor em segundo plano (só se ainda não estiver rodando)
if (-not (Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue)) {
  Start-Process node -ArgumentList 'server.js' -WindowStyle Hidden
  Start-Sleep -Seconds 2
}

npx cap sync android
npx cap run android --target Medium_Phone_API_36.1
