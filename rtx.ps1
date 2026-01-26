# --- 1. Security & Stability Fix ---
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$WebClient = New-Object System.Net.WebClient
$WebClient.Headers.Add("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")

# --- 2. Define Paths ---
$mcPath = "$env:APPDATA\.minecraft"
$modsPath = "$mcPath\mods"
$shaderPath = "$mcPath\shaderpacks"

# --- 3. Clear the Mods Folder ---
Write-Host "Cleaning mods folder..." -ForegroundColor Cyan
if (Test-Path $modsPath) {
    Remove-Item -Path "$modsPath\*" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Done! Folder is empty." -ForegroundColor Gray
} else {
    New-Item -ItemType Directory -Force -Path $modsPath
}

# --- 4. Download Your Specific Files ---
Write-Host "Downloading Iris 1.7.3..." -ForegroundColor Yellow
$WebClient.DownloadFile("https://cdn.modrinth.com/data/YL57xq9U/versions/ZQx4ktUs/iris-fabric-1.10.5%2Bmc1.21.11.jar", "$modsPath\iris-1.7.3.jar")

Write-Host "Downloading Sodium 0.5.11..." -ForegroundColor Yellow
$WebClient.DownloadFile("https://cdn.modrinth.com/data/AANobbMI/versions/1OWNgWVR/sodium-fabric-0.8.4%2Bmc1.21.11.jar", "$modsPath\sodium-0.5.11.jar")

Write-Host "Downloading Complementary Unbound r5.6.1..." -ForegroundColor Yellow
if (!(Test-Path $shaderPath)) { New-Item -ItemType Directory -Force -Path $shaderPath }
$WebClient.DownloadFile("https://cdn.modrinth.com/data/R6NEzAwj/versions/LXrX6oqm/ComplementaryUnbound_r5.6.1.zip", "$shaderPath\ComplementaryUnbound_r5.6.1.zip")

Write-Host "`n--- All Set! ---" -ForegroundColor Green
Write-Host "Mods folder updated and Shaders added."
Pause