# ===============================
# Sync DEV (Org Repo) → DEPLOY (Personal Repo)
# Monorepo-safe (frontend + backend)
# ===============================

$ErrorActionPreference = "Stop"

# -------- CONFIG --------
$DEV_REPO_URL     = "https://github.com/Delpat-Tech/scavengerHunt.git"
$DEV_BRANCH       = "dev"

$DEPLOY_REPO_URL  = "https://github.com/Maaz-21/scv.git"
$DEPLOY_BRANCH    = "main"

$COMMIT_PREFIX    = "Sync changes from parent repo"

# -------- PRE-CHECK --------
Write-Host "Checking git status..."
if (git status --porcelain) {
    Write-Host "ERROR: Working tree is not clean." -ForegroundColor Red
    exit 1
}

# -------- STEP 1: Pull DEV --------
Write-Host "`nPulling from DEV repo..."
git remote set-url origin $DEV_REPO_URL
git fetch origin
git checkout $DEV_BRANCH
git pull origin $DEV_BRANCH

# -------- STEP 2: Switch to DEPLOY --------
Write-Host "`nSwitching to DEPLOY repo..."
git remote set-url origin $DEPLOY_REPO_URL
git fetch origin

# Ensure deploy branch exists
git checkout $DEPLOY_BRANCH 2>$null
if ($LASTEXITCODE -ne 0) {
    git checkout -b $DEPLOY_BRANCH
}

git pull origin $DEPLOY_BRANCH 2>$null

# -------- STEP 3: Build FRONTEND --------
Write-Host "`nBuilding frontend..."
Set-Location frontend
npm install
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend build failed." -ForegroundColor Red
    exit 1
}
Set-Location ..

# -------- STEP 4: Build BACKEND --------
Write-Host "`nBuilding backend..."
Set-Location backend
npm install
npm run build 2>$null   # backend may not have build script; ignore if missing
Set-Location ..

# -------- STEP 5: Commit & push --------
$lastCommitMsg = git log -1 --pretty=%B
$commitNumber = 1
if ($lastCommitMsg -match "$COMMIT_PREFIX\s+(\d+)") {
    $commitNumber = [int]$matches[1] + 1
}
$commitMessage = "$COMMIT_PREFIX $commitNumber"

Write-Host "`nCommitting and pushing..."
git add .
git commit -m "$commitMessage"
git push origin $DEPLOY_BRANCH

# -------- STEP 6: Restore DEV --------
git remote set-url origin $DEV_REPO_URL
git checkout $DEV_BRANCH

Write-Host "`nDONE. Synced successfully."
Write-Host "Commit: $commitMessage"
