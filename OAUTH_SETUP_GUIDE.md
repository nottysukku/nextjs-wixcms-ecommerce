# 🚀 Complete OAuth Setup Guide

## The "Invalid redirect URI" error occurs because your Wix app needs to be properly configured. Here's how to fix it:

## Step 1: Get Your Wix Client ID

1. **Go to Wix Developer Console**:
   - Visit: https://dev.wix.com/apps
   - Sign in with your Wix account

2. **Create or Select Your App**:
   - If you don't have an app, click "Create New App"
   - If you have an app, click on it to open

3. **Find Your Client ID**:
   - Look for "OAuth" or "Authentication" section
   - Copy the **Client ID** (it looks like: `14c1345b-1234-1234-1234-123456789abc`)

4. **Update Your Environment File**:
   - Open `.env.local` in your project
   - Replace `your-wix-client-id-here` with your actual Client ID:
   ```
   NEXT_PUBLIC_WIX_CLIENT_ID=14c1345b-1234-1234-1234-123456789abc
   ```

## Step 2: Configure Redirect URIs

1. **In the same OAuth section**, find "Redirect URIs" or "Allowed Redirect URIs"

2. **Add these exact URLs**:
   ```
   http://localhost:3000/login
   http://localhost:3000
   https://yourdomain.com/login
   https://yourdomain.com
   ```

3. **Click Save/Update**

## Step 3: Enable Social Login Providers

1. **In your Wix app settings**, look for "Social Login" or "Login Options"

2. **Enable the providers you want**:
   - ✅ Google
   - ✅ Facebook
   - ✅ Apple (optional)

3. **Configure each provider**:
   - Follow Wix's instructions for Google/Facebook app setup
   - Make sure each provider is properly configured

## Step 4: Test the Setup

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Visit your login page**: http://localhost:3000/login

3. **Try the social login buttons**:
   - Click "Continue with Google" or "Continue with Facebook"
   - You should be redirected to the provider's login page
   - After login, you should be redirected back to your app

## 🔧 Troubleshooting

### Issue: "Invalid redirect URI"
**Solution**: Make sure you added the exact URLs to your Wix OAuth settings

### Issue: "App not found" or "Client ID not found"
**Solution**: Check that your `NEXT_PUBLIC_WIX_CLIENT_ID` is correct in `.env.local`

### Issue: Social login buttons don't work
**Solution**: Make sure Google/Facebook are enabled in your Wix app settings

### Issue: "State mismatch"
**Solution**: Clear browser storage and try again

## 📝 Quick Checklist

- [ ] ✅ Wix app created at dev.wix.com
- [ ] ✅ Client ID copied to `.env.local`
- [ ] ✅ Redirect URIs added to Wix OAuth settings
- [ ] ✅ Google/Facebook social login enabled in Wix
- [ ] ✅ Development server restarted
- [ ] ✅ Tested social login buttons

## 🆘 Still Having Issues?

1. **Check browser console** for detailed error messages
2. **Verify environment variables** are loaded (check Network tab)
3. **Wait 5-10 minutes** after making Wix configuration changes
4. **Clear browser cookies/storage** and try again
5. **Check Wix app status** - make sure it's published/active

## 💡 Pro Tips

- Use different redirect URIs for development and production
- Test with an incognito browser window to avoid caching issues
- Keep your Wix Developer Console open to check for configuration errors
- Monitor the browser's Network tab to see OAuth requests/responses

---

**Need help?** Check the detailed error messages in your browser console - they often contain specific guidance for fixing configuration issues.
