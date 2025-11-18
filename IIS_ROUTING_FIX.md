# Fix 404 Errors for Vue.js Routes in IIS

## Problem
Getting 404 errors when navigating to routes like `/login`, `/items`, etc.

## Solution

### 1. Verify URL Rewrite Module is Installed

The URL Rewrite Module is **required** for Vue.js routing to work in IIS.

**Check if installed:**
1. Open IIS Manager
2. Select your server (not the site)
3. Look for "URL Rewrite" in the Features View
4. If not present, download and install: https://www.iis.net/downloads/microsoft/url-rewrite

### 2. Verify web.config is Correct

The `web.config` file must be in the root of your IIS application directory:
- Location: `C:\inetpub\wwwroot\VueNetCrudApp\web.config`

### 3. Test the Rewrite Rules

1. Open IIS Manager
2. Select your website
3. Double-click "URL Rewrite"
4. You should see the "Vue Routes" rule
5. If not, the web.config might not be loaded correctly

### 4. Check Application Pool

1. Select your website
2. Click "Basic Settings" in the right panel
3. Note the Application Pool name
4. Go to Application Pools
5. Select your pool → "Advanced Settings"
6. Ensure:
   - **.NET CLR Version**: No Managed Code (for static files)
   - **Managed Pipeline Mode**: Integrated

### 5. Restart IIS

After making changes:
```powershell
iisreset
```

Or restart the Application Pool:
1. IIS Manager → Application Pools
2. Right-click your pool → "Recycle"

### 6. Clear Browser Cache

Sometimes cached 404 responses cause issues:
- Press `Ctrl + Shift + Delete`
- Clear cached images and files
- Or use Incognito/Private mode

## Troubleshooting

### Still Getting 404?

1. **Check IIS Logs:**
   ```
   C:\inetpub\logs\LogFiles\W3SVC[site-id]\*.log
   ```

2. **Test Direct Access:**
   - Try: `https://local.vueclient.com/index.html`
   - Should load the app

3. **Check File Permissions:**
   ```powershell
   icacls "C:\inetpub\wwwroot\VueNetCrudApp" /grant "IIS_IUSRS:(OI)(CI)R" /T
   ```

4. **Verify web.config Syntax:**
   - Open web.config in a text editor
   - Check for XML syntax errors
   - Validate at: https://www.xmlvalidation.com/

5. **Check for Parent web.config:**
   - Parent directories might have conflicting web.config files
   - Check: `C:\inetpub\wwwroot\web.config`

## Alternative: Use Hash Mode (Not Recommended)

If URL Rewrite still doesn't work, you can use hash mode routing:

**In `vue-client/src/router/index.ts`:**
```typescript
import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(), // Use hash mode
  routes,
});
```

This will make URLs like: `https://local.vueclient.com/#/login`

But this is not recommended for production - fix the rewrite rules instead.

## Success Indicators

After fixing, you should be able to:
- ✅ Access `https://local.vueclient.com/` - Shows home page
- ✅ Access `https://local.vueclient.com/login` - Shows login page (not 404)
- ✅ Access `https://local.vueclient.com/items` - Shows items page (after login)
- ✅ Access `https://local.vueclient.com/products` - Shows products page
- ✅ Browser refresh on any route works (doesn't show 404)

