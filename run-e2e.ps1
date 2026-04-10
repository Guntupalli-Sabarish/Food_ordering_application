param(
    [string]$PostgresServiceName = "postgresql-x64-18",
    [string]$PostgresUser = "postgres",
    [string]$PostgresPassword = "sai123456789",
    [string]$DatabaseName = "foodordering_application",
    [string]$GoogleClientId = "",
    [string]$RazorpayKeyId = "rzp_test_XXXXXXXXXXXXXXXX",
    [string]$RazorpayKeySecret = "your_razorpay_secret",
    [int]$BackendPort = 8080,
    [int]$FrontendPort = 5173
)

$ErrorActionPreference = "Stop"

$workspaceRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $workspaceRoot "food-ordering-backend"
$frontendPath = Join-Path $workspaceRoot "food-ordering-frontend"
$psqlPath = "C:\Program Files\PostgreSQL\18\bin\psql.exe"

if (-not (Test-Path $backendPath)) {
    throw "Backend folder not found: $backendPath"
}

if (-not (Test-Path $frontendPath)) {
    throw "Frontend folder not found: $frontendPath"
}

if (-not (Test-Path $psqlPath)) {
    throw "psql not found at $psqlPath. Install PostgreSQL 18 or update the path in this script."
}

$service = Get-Service -Name $PostgresServiceName -ErrorAction SilentlyContinue
if (-not $service) {
    throw "PostgreSQL service '$PostgresServiceName' not found. Check your service name with: Get-Service *postgres*"
}

if ($service.Status -ne "Running") {
    Write-Host "Starting PostgreSQL service: $PostgresServiceName"
    Start-Service -Name $PostgresServiceName
}

$env:PGPASSWORD = $PostgresPassword
$dbExists = (& $psqlPath -h localhost -U $PostgresUser -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DatabaseName';").Trim()
if ($dbExists -ne "1") {
    Write-Host "Creating database: $DatabaseName"
    & $psqlPath -h localhost -U $PostgresUser -d postgres -c "CREATE DATABASE $DatabaseName;" | Out-Null
}

$backendEnvContent = @"
DB_URL=jdbc:postgresql://localhost:5432/$DatabaseName
DB_USERNAME=$PostgresUser
DB_PASSWORD=$PostgresPassword
JWT_SECRET=DevOnlyJwtSecretKeyAtLeast32Characters123456
GOOGLE_CLIENT_ID=$GoogleClientId
RAZORPAY_KEY_ID=$RazorpayKeyId
RAZORPAY_KEY_SECRET=$RazorpayKeySecret
MAIL_USERNAME=no-reply@foodapp.local
MAIL_PASSWORD=dummy
PORT=$BackendPort
"@

Set-Content -Path (Join-Path $backendPath ".env") -Value $backendEnvContent

$frontendEnvContent = @"
VITE_API_BASE_URL=http://localhost:$BackendPort/api
VITE_GOOGLE_CLIENT_ID=$GoogleClientId
VITE_RAZORPAY_KEY_ID=$RazorpayKeyId
"@

Set-Content -Path (Join-Path $frontendPath ".env") -Value $frontendEnvContent

$backendCmd = "Set-Location '$backendPath'; mvn spring-boot:run -DskipTests"
$frontendCmd = "Set-Location '$frontendPath'; if (Test-Path 'node_modules') { npm run dev } else { npm install; npm run dev }"

Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd | Out-Null
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd | Out-Null

Write-Host ""
Write-Host "Started successfully."
Write-Host "Backend:  http://localhost:$BackendPort"
Write-Host "Frontend: http://localhost:$FrontendPort"
Write-Host ""
Write-Host "If this is first run, wait for both terminals to finish startup logs."
