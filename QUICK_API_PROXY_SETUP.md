# Quick API Proxy Setup for IIS

Since your API is hosted separately in the same IIS, follow these steps:

## Step 1: Find Your API Site URL

1. Open IIS Manager
2. Find your API site (probably `VueNetCrudApi` or similar)
3. Right-click → **Edit Bindings**
4. Note the **Port** and **Host name**
   - Example: Port `5280`, Host name: (empty) → URL: `http://localhost:5280`
   - Example: Port `80`, Host name: `api.local.vueclient.com` → URL: `http://api.local.vueclient.com`

## Step 2: Install Application Request Routing (ARR)

1. Download: https://www.iis.net/downloads/microsoft/application-request-routing
2. Install it
3. Restart IIS: `iisreset`

## Step 3: Enable Proxy in ARR

1. IIS Manager → Select your **server** (top level, not a site)
2. Double-click **Application Request Routing Cache**
3. Click **Server Proxy Settings** (right panel)
4. Check **Enable proxy**
5. Click **Apply**

## Step 4: Update web.config with Your API URL

Edit `C:\inetpub\wwwroot\VueNetCrudApp\web.config` and update line 9:

**If your API is on port 5280:**
```xml
<action type="Rewrite" url="http://localhost:5280/api/{R:1}" />
```

**If your API is on a different port (e.g., 5000):**
```xml
<action type="Rewrite" url="http://localhost:5000/api/{R:1}" />
```

**If your API has a different hostname:**
```xml
<action type="Rewrite" url="http://api.local.vueclient.com/api/{R:1}" />
```

**If your API is on HTTPS:**
```xml
<action type="Rewrite" url="https://api.local.vueclient.com/api/{R:1}" />
```

## Step 5: Restart IIS

```powershell
iisreset
```

## Step 6: Test

1. Open browser: `https://local.vueclient.com`
2. Try to login
3. Check browser console (F12) for any errors
4. Test API directly: `https://local.vueclient.com/api/Product` (should return data)

---

## Alternative: Use Virtual Directory (No ARR Required)

If you don't want to install ARR:

1. IIS Manager → Your Vue app site
2. Right-click → **Add Virtual Directory**
3. **Alias**: `api`
4. **Physical path**: Point to your API site's physical path
5. Click **OK**

This makes `/api` requests go directly to your API site without needing ARR.

---

## What Port is Your API On?

Please tell me:
- What port is your API site running on?
- What hostname (if any) is configured for your API site?

Then I can update the web.config with the exact URL.

