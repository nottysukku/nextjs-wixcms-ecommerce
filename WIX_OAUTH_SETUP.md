# Wix OAuth Setup Guide

## 🔧 Fix "Invalid redirect URI" Error

If you're getting an "Invalid redirect URI" error when trying to use Google or Facebook login, follow these steps:

### Step 1: Access Wix Developer Console
1. Go to [https://dev.wix.com/apps](https://dev.wix.com/apps)
2. Sign in with your Wix account
3. Select your app from the list

### Step 2: Configure OAuth Settings
1. In your app dashboard, navigate to:
   - **"OAuth"** section, or
   - **"Authentication"** section, or 
   - **"Settings" → "OAuth"**

2. Look for **"Redirect URIs"** or **"Allowed Redirect URIs"**

### Step 3: Add Required Redirect URIs

Add these exact URLs (replace `yourdomain.com` with your actual domain):

#### For Development:
```
http://localhost:3000/login
http://localhost:3000
```

#### For Production:
```
https://yourdomain.com/login
https://yourdomain.com
```

#### If using a different port (e.g., 3001):
```
http://localhost:3001/login
http://localhost:3001
```

### Step 4: Save and Test
1. Click **"Save"** or **"Update"**
2. Wait a few minutes for changes to propagate
3. Try the social login again

## 🚀 Current Configuration

Your app is currently configured to redirect to:
- Development: `http://localhost:3000/login`
- Production: `https://yourdomain.com/login`

## 🔍 Troubleshooting

### Common Issues:
1. **"Invalid redirect URI"** - URI not added to Wix OAuth settings
2. **"State mismatch"** - Browser storage cleared during OAuth flow
3. **"App not found"** - Wrong `NEXT_PUBLIC_WIX_CLIENT_ID` in `.env`

### Debug Mode:
Check the browser console for detailed OAuth logs when testing social login.

### Environment Variables:
Make sure your `.env.local` has:
```
NEXT_PUBLIC_WIX_CLIENT_ID=your-wix-client-id
```

## 📝 Notes

- Changes to OAuth settings may take 5-10 minutes to take effect
- Make sure to use the exact URLs (including `/login` path)
- Both HTTP (development) and HTTPS (production) URLs should be added
- Root URLs (without `/login`) are also recommended for broader compatibility

## 🆘 Still Having Issues?

1. Double-check the redirect URIs are exactly as shown above
2. Make sure your Wix app is published/deployed
3. Try clearing browser storage and cookies
4. Check the browser network tab for detailed error responses
5. Verify your `NEXT_PUBLIC_WIX_CLIENT_ID` is correct
