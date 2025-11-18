# Setting Up API Proxy in IIS

Since your API is hosted separately in the same IIS, you need to configure a reverse proxy to forward `/api` requests to your API site.

## Option 1: Using URL Rewrite (Recommended)

The `web.config` I've created uses URL Rewrite to proxy API requests. However, you need to:

### Step 1: Install Application Request Routing (ARR)

1. Download ARR: https://www.iis.net/downloads/microsoft/application-request-routing
2. Install the module
3. Restart IIS: `iisreset`

### Step 2: Enable Proxy in ARR

1. Open IIS Manager
2. Select your **server** (top level)
3. Double-click **Application Request Routing Cache**
4. Click **Server Proxy Settings** (right panel)
5. Check **Enable proxy**
6. Click **Apply**

### Step 3: Update web.config with Correct API URL

Edit `C:\inetpub\wwwroot\VueNetCrudApp\web.config` and update the API Proxy rule:

```xml
<rule name="API Proxy" stopProcessing="true">
  <match url="^api/(.*)" />
  <action type="Rewrite" url="http://localhost:5280/api/{R:1}" />
</rule>
```

**Update the URL based on your API site:**
- If API is on port 5280: `http://localhost:5280/api/{R:1}`
- If API is on different port: `http://localhost:PORT/api/{R:1}`
- If API has different hostname: `http://api.yourdomain.com/api/{R:1}`
- If API is on HTTPS: `https://your-api-domain.com/api/{R:1}`

### Step 4: Rebuild and Redeploy Vue App

```powershell
cd C:\Learn\VueNetCrud\vue-client
npm run build
# Copy files to IIS
xcopy /E /I /Y "dist\*" "C:\inetpub\wwwroot\VueNetCrudApp"
Copy-Item "web.config" -Destination "C:\inetpub\wwwroot\VueNetCrudApp\web.config" -Force
```

---

## Option 2: Using Virtual Directory (Simpler)

If you don't want to use ARR, you can create a virtual directory:

### Step 1: Create Virtual Directory in IIS

1. Open IIS Manager
2. Select your Vue app site (`VueNetCrudApp`)
3. Right-click → **Add Virtual Directory**
4. Configure:
   - **Alias**: `api`
   - **Physical path**: `C:\inetpub\wwwroot\VueNetCrudApi` (your API directory)
5. Click **OK**

### Step 2: Update API Base URL

The Vue app already uses `/api` as relative path, so it should work automatically.

### Step 3: Remove Proxy Rule from web.config

If using virtual directory, remove the API Proxy rule from web.config:

```xml
<!-- Remove this rule if using virtual directory -->
<!-- <rule name="API Proxy" stopProcessing="true">...</rule> -->
```

---

## Option 3: Direct URL (No Proxy)

If your API is accessible directly, update the API base URL:

### Update `vue-client/src/services/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.PROD 
  ? 'http://localhost:5280/api'  // Direct URL to API
  : 'http://localhost:5280/api';
```

Then rebuild and redeploy.

**Note:** This requires CORS to be configured on the API to allow requests from your Vue app domain.

---

## Verify Your API Site Configuration

1. **Check API Site Binding:**
   - IIS Manager → Your API Site → Bindings
   - Note the port and hostname

2. **Test API Directly:**
   - `http://localhost:5280/api/Product` (or your API port)
   - Should return data

3. **Check CORS Configuration:**
   - Ensure API allows your Vue app domain
   - Update `CorsExtensions.cs` if needed

---

## Quick Setup Checklist

- [ ] Application Request Routing (ARR) installed
- [ ] ARR proxy enabled in IIS
- [ ] web.config updated with correct API URL
- [ ] Vue app rebuilt with `/api` as base URL
- [ ] Files copied to IIS
- [ ] Test API proxy: `https://local.vueclient.com/api/Product`
- [ ] CORS configured on API for Vue app domain

---

## Troubleshooting

### API Still Returns 404

1. **Check ARR is enabled:**
   - IIS Manager → Server → Application Request Routing Cache
   - Verify "Enable proxy" is checked

2. **Check web.config syntax:**
   - Verify the rewrite rule URL matches your API site
   - Check for XML syntax errors

3. **Check API site is running:**
   - Verify API site is started in IIS
   - Test API directly: `http://localhost:5280/api/Product`

4. **Check IIS logs:**
   - `C:\inetpub\logs\LogFiles\W3SVC*`
   - Look for proxy/rewrite errors

### CORS Errors

If you see CORS errors, update API CORS configuration to include your Vue app domain:
- `https://local.vueclient.com`
- Or use `*` for development (not recommended for production)

---

## Recommended Setup

For same IIS deployment, I recommend **Option 1 (URL Rewrite with ARR)** because:
- ✅ Clean URLs (`/api/...`)
- ✅ No CORS issues (same origin)
- ✅ Better security
- ✅ Easier to manage

