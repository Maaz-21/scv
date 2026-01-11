# ===============================
# Sync DEV (Org Repo) → DEPLOY (Personal Repo)
# with build safety check
# ===============================

$ErrorActionPreference = "Stop"

# -------- CONFIG --------
$DEV_REPO_URL     = "https://github.com/Delpat-Tech/scavengerHunt.git"
$DEV_BRANCH       = "dev"

$DEPLOY_REPO_URL  = "https://github.com/Maaz-21/scv.git"
$DEPLOY_BRANCH    = "main"

$COMMIT_PREFIX    = "Sync changes from parent repo"

# -------- PRE-CHECKS --------
Write-Host " Checking git status..."
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host " Working tree is not clean. Commit or stash changes first." -ForegroundColor Red
    exit 1
}

# -------- STEP 1: Pull from DEV repo --------
Write-Host "`n Pulling latest code from DEV (organization) repo..."
git remote set-url origin $DEV_REPO_URL

git fetch origin
git checkout $DEV_BRANCH
git pull origin $DEV_BRANCH

# -------- STEP 2: Switch to DEPLOY repo --------
Write-Host "`n Switching to DEPLOY (personal) repo..."
git remote set-url origin $DEPLOY_REPO_URL

git fetch origin
git checkout $DEPLOY_BRANCH
git pull origin $DEPLOY_BRANCH

# -------- STEP 3: Run build check --------
Write-Host "`n Running build check (npm run build)..."
npm install
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host " Build failed. Fix errors before deploying." -ForegroundColor Red
    exit 1
}

# -------- STEP 4: Generate incremental commit message --------
$lastCommitMsg = git log -1 --pretty=%B
$commitNumber = 1

if ($lastCommitMsg -match "$COMMIT_PREFIX\s+(\d+)") {
    $commitNumber = [int]$matches[1] + 1
}

$commitMessage = "$COMMIT_PREFIX $commitNumber"

# -------- STEP 5: Commit & push to DEPLOY repo --------
Write-Host "`n Committing and pushing to DEPLOY repo..."
git add .
git commit -m "$commitMessage"
git push origin $DEPLOY_BRANCH

# -------- STEP 6: Restore DEV repo as origin --------
Write-Host "`n Restoring DEV repo as origin..."
git remote set-url origin $DEV_REPO_URL
git checkout $DEV_BRANCH

Write-Host "`n DONE. Build passed and changes pushed successfully." -ForegroundColor Green
Write-Host " Commit message: $commitMessage"