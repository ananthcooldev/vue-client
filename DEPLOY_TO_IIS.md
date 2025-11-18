# Deploy Vue.js Frontend to IIS

Step-by-step guide to deploy your Vue.js application to IIS.

## 📋 Prerequisites

1. **IIS Installed** on Windows Server or Windows 10/11
2. **URL Rewrite Module** installed
   - Download: https://www.iis.net/downloads/microsoft/url-rewrite
   - Required for Vue.js client-side routing

---

## 🚀 Step-by-Step Deployment

### Step 1: Build the Vue.js Application

```powershell
cd C:\Learn\VueNetCrud\vue-client
npm install
npm run build
```

This creates a `dist` folder with production-ready files.

**Verify build output:**
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── ...
```

---

### Step 2: Copy Files to IIS Directory

#### Option A: Manual Copy

```powershell
# Create IIS directory (if it doesn't exist)
New-Item -ItemType Directory -Path "C:\inetpub\wwwroot\VueNetCrudApp" -Force

# Copy all files from dist folder
xcopy /E /I /Y "C:\Learn\VueNetCrud\vue-client\dist\*" "C:\inetpub\wwwroot\VueNetCrudApp"
```

#### Option B: Use PowerShell

```powershell
$source = "C:\Learn\VueNetCrud\vue-client\dist"
$destination = "C:\inetpub\wwwroot\VueNetCrudApp"

# Remove existing files (optional)
if (Test-Path $destination) {
    Remove-Item "$destination\*" -Recurse -Force
}

# Copy files
Copy-Item "$source\*" -Destination $destination -Recurse -Force
Write-Host "Files copied successfully!" -ForegroundColor Green
```

---

### Step 3: Copy web.config File

The `web.config` file is **essential** for Vue.js routing to work in IIS.

```powershell
# Copy web.config to IIS directory
Copy-Item "C:\Learn\VueNetCrud\vue-client\web.config" -Destination "C:\inetpub\wwwroot\VueNetCrudApp\web.config" -Force
```

**Important:** Without `web.config`, Vue.js routes (like `/login`, `/items`) will return 404 errors.

---

### Step 4: Configure IIS

#### 4.1 Open IIS Manager

1. Press `Windows + R`
2. Type `inetmgr` and press Enter
3. IIS Manager opens

#### 4.2 Create Application Pool (Optional but Recommended)

1. Right-click **Application Pools** → **Add Application Pool**
2. Configure:
   - **Name**: `VueNetCrudAppPool`
   - **.NET CLR Version**: **No Managed Code** (Vue.js is static files)
   - **Managed Pipeline Mode**: **Integrated**
3. Click **OK**

#### 4.3 Create Website

1. Right-click **Sites** → **Add Website**
2. Configure:
   - **Site name**: `VueNetCrudApp`
   - **Application pool**: `VueNetCrudAppPool` (or `DefaultAppPool`)
   - **Physical path**: `C:\inetpub\wwwroot\VueNetCrudApp`
   - **Binding**:
     - **Type**: `http`
     - **IP address**: `All Unassigned` (or specific IP)
     - **Port**: `80` (or your preferred port like `8080`)
     - **Host name**: Leave empty (or enter domain like `app.yourdomain.com`)
3. Click **OK**

---

### Step 5: Set Folder Permissions

```powershell
# Grant IIS_IUSRS read permissions
icacls "C:\inetpub\wwwroot\VueNetCrudApp" /grant "IIS_IUSRS:(OI)(CI)R" /T
```

Or manually:
1. Right-click `C:\inetpub\wwwroot\VueNetCrudApp` → **Properties**
2. Go to **Security** tab
3. Click **Edit** → **Add**
4. Enter `IIS_IUSRS` → **Check Names** → **OK**
5. Select `IIS_IUSRS` → Check **Read & execute** and **Read**
6. Click **OK**

---

### Step 6: Update API Base URL (If Needed)

If your API is on a different server/domain, update the API URL:

**Before building**, edit `vue-client/src/services/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.PROD 
  ? 'http://your-api-server.com/api'  // Production API URL
  : 'http://localhost:5280/api';      // Development
```

Then rebuild:
```powershell
npm run build
```

---

### Step 7: Test the Deployment

1. **Open browser**: `http://localhost` (or your configured port)
2. **Verify**:
   - ✅ App loads correctly
   - ✅ Navigation works (try `/login`, `/items`, `/products`)
   - ✅ API calls work (check browser console)
   - ✅ No 404 errors for routes

---

## 🔧 Troubleshooting

### Issue: Blank Page

**Solution:**
1. Check browser console for errors
2. Verify `index.html` exists in the root
3. Check file permissions
4. Verify `web.config` is present

### Issue: 404 Errors on Routes (e.g., `/login`)

**Solution:**
1. **Install URL Rewrite Module** (if not installed)
2. Verify `web.config` exists and has rewrite rules
3. Check IIS logs: `C:\inetpub\logs\LogFiles\W3SVC*`

### Issue: API Calls Fail (CORS or Connection)

**Solution:**
1. Check API is running and accessible
2. Update API base URL in `api.ts` if API is on different domain
3. Verify CORS is configured on API server
4. Check browser console for specific errors

### Issue: Assets Not Loading (CSS/JS files)

**Solution:**
1. Check file paths in browser DevTools → Network tab
2. Verify all files were copied from `dist` folder
3. Check MIME types in `web.config`
4. Clear browser cache

### Issue: Permission Denied

**Solution:**
```powershell
# Grant full permissions (run as Administrator)
icacls "C:\inetpub\wwwroot\VueNetCrudApp" /grant "IIS_IUSRS:(OI)(CI)F" /T
```

---

## 📝 Deployment Script

Create `deploy-frontend.ps1`:

```powershell
# Vue.js Frontend Deployment Script
param(
    [string]$OutputPath = "C:\inetpub\wwwroot\VueNetCrudApp",
    [string]$ProjectPath = "C:\Learn\VueNetCrud\vue-client"
)

Write-Host "Building Vue.js application..." -ForegroundColor Green
Set-Location $ProjectPath

# Build
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Copying files to IIS..." -ForegroundColor Green

# Create directory if it doesn't exist
if (-not (Test-Path $OutputPath)) {
    New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
}

# Remove existing files
Remove-Item "$OutputPath\*" -Recurse -Force -ErrorAction SilentlyContinue

# Copy dist files
Copy-Item "$ProjectPath\dist\*" -Destination $OutputPath -Recurse -Force

# Copy web.config
Copy-Item "$ProjectPath\web.config" -Destination $OutputPath -Force

# Set permissions
Write-Host "Setting permissions..." -ForegroundColor Green
icacls $OutputPath /grant "IIS_IUSRS:(OI)(CI)R" /T /Q | Out-Null

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "App location: $OutputPath" -ForegroundColor Yellow
```

**Usage:**
```powershell
.\deploy-frontend.ps1
```

---

## 🎯 Quick Deployment Checklist

- [ ] Vue.js app built (`npm run build`)
- [ ] `dist` folder contains all files
- [ ] Files copied to IIS directory
- [ ] `web.config` copied to IIS directory
- [ ] URL Rewrite Module installed
- [ ] IIS website created
- [ ] Application pool configured
- [ ] Folder permissions set
- [ ] API base URL updated (if needed)
- [ ] Tested in browser
- [ ] Routes work correctly
- [ ] API calls work

---

## 📊 IIS Configuration Summary

```
IIS Site: VueNetCrudApp
├── Physical Path: C:\inetpub\wwwroot\VueNetCrudApp
├── Port: 80 (or your choice)
├── Application Pool: VueNetCrudAppPool (No Managed Code)
└── web.config: Present (for routing)
```

---

## 🔄 Updating the Deployment

To update the app after making changes:

1. **Rebuild:**
   ```powershell
   cd vue-client
   npm run build
   ```

2. **Redeploy:**
   ```powershell
   # Copy new files
   xcopy /E /I /Y "dist\*" "C:\inetpub\wwwroot\VueNetCrudApp"
   ```

Or use the deployment script:
```powershell
.\deploy-frontend.ps1
```

---

## 🌐 Production Considerations

### 1. Enable HTTPS

1. Install SSL certificate
2. Add HTTPS binding in IIS
3. Update API URL to use HTTPS

### 2. Configure Custom Domain

1. Add host name in IIS binding
2. Update DNS records
3. Update API base URL if needed

### 3. Performance Optimization

- Enable compression in IIS
- Configure caching headers
- Use CDN for static assets (optional)

### 4. Security

- Remove source maps in production build
- Set proper security headers
- Configure CORS on API server

---

## ✅ Success Indicators

After deployment, you should see:

- ✅ App loads at `http://localhost` (or your port)
- ✅ All routes work (`/`, `/login`, `/items`, `/products`)
- ✅ API calls succeed
- ✅ No console errors
- ✅ Assets load correctly (CSS, JS, images)

---

**Need help?** Check the troubleshooting section or review IIS logs.

