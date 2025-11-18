# API Cross-Domain Setup

Your API is on `https://local.api.com` and Vue app is on `https://local.vueclient.com`.

## ✅ What I've Done

1. **Updated API Base URL** in `vue-client/src/services/api.ts`:
   - Production: `https://local.api.com/api`
   - Development: `http://localhost:5280/api`

2. **Removed Proxy Rule** from `web.config`:
   - API requests now go directly to `https://local.api.com/api`
   - No IIS proxy needed

3. **Updated CORS Configuration** in API:
   - Added `https://local.vueclient.com` to allowed origins
   - Added `http://local.vueclient.com` (if using HTTP)

## 🔧 Next Steps

### Step 1: Rebuild and Redeploy API (If CORS Changed)

If you updated the CORS configuration, rebuild and redeploy your API:

```powershell
cd C:\Learn\VueNetCrud\VueNetCrud.Server
dotnet publish -c Release -o C:\inetpub\wwwroot\VueNetCrudApi
```

### Step 2: Restart API Application Pool

1. IIS Manager → Application Pools
2. Find your API application pool
3. Right-click → Recycle

### Step 3: Verify CORS on API

Test that CORS is working:

```powershell
# Test CORS preflight
Invoke-WebRequest -Uri "https://local.api.com/api/Product" -Method OPTIONS -Headers @{"Origin"="https://local.vueclient.com"}
```

### Step 4: Test Vue App

1. Open: `https://local.vueclient.com`
2. Try to login
3. Check browser console (F12) for errors
4. Check Network tab to verify API calls go to `https://local.api.com/api/...`

## 🔍 Troubleshooting

### CORS Errors

If you see CORS errors in browser console:

1. **Verify API CORS includes your Vue domain:**
   - Check `CorsExtensions.cs` includes `https://local.vueclient.com`
   - Rebuild and redeploy API

2. **Check API is running:**
   - Test: `https://local.api.com/api/Product`
   - Should return data

3. **Check browser console:**
   - Look for CORS error messages
   - Verify the Origin header matches allowed origins

### 404 Errors on API

If API returns 404:

1. **Verify API URL is correct:**
   - Check `https://local.api.com/api/Product` works directly
   - Verify the API site is running in IIS

2. **Check API routes:**
   - Test: `https://local.api.com/api/Auth/login`
   - Should return response (even if error, not 404)

### SSL Certificate Issues

If you see SSL errors:

1. **Verify certificates:**
   - Both `local.vueclient.com` and `local.api.com` need valid SSL certificates
   - Or use HTTP for development

2. **Update API URL to HTTP if needed:**
   - Change in `api.ts`: `http://local.api.com/api`

## ✅ Success Indicators

After setup, you should see:

- ✅ API calls in browser Network tab go to `https://local.api.com/api/...`
- ✅ No CORS errors in console
- ✅ Login works successfully
- ✅ Data loads from API

## 📝 Current Configuration

**Vue App:**
- URL: `https://local.vueclient.com`
- API Base: `https://local.api.com/api`

**API:**
- URL: `https://local.api.com`
- CORS Origins: Includes `https://local.vueclient.com`

