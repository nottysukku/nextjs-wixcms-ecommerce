# Google Maps Integration Setup Guide

## 📍 Overview
This project includes a Google Maps integration on the contact page, showing the business location in Central Delhi, New Delhi.

## 🚀 Quick Setup

### 1. Get Google Maps API Key
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API** (Required)
   - **Places API** (Optional - for enhanced features)

### 2. Create API Key
1. Navigate to "Credentials" in the Google Cloud Console
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key

### 3. Configure Environment Variables
1. Open the `.env.local` file in your project root
2. Replace `your_google_maps_api_key_here` with your actual API key:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### 4. Secure Your API Key (Recommended)
1. In Google Cloud Console, go to your API key settings
2. Add application restrictions:
   - **HTTP referrers (web sites)**
   - Add your domain: `https://yourdomain.com/*`
   - For development: `http://localhost:3000/*`

### 5. Set API Quotas (Optional)
1. Go to "APIs & Services" → "Quotas"
2. Set daily limits to control usage and costs

## 🗺️ Features

### Current Implementation
- **Interactive Map**: Displays Central Delhi, New Delhi location
- **Custom Marker**: Red marker with business branding
- **Info Window**: Shows business details, contact info, and hours
- **Directions**: Direct link to Google Maps for navigation
- **Responsive Design**: Works on all device sizes
- **Dark Mode Support**: Styled for both light and dark themes
- **Error Handling**: Graceful fallback if maps fail to load

### Map Location Details
- **Coordinates**: 28.6304°N, 77.2177°E (Central Delhi)
- **Address**: 3252 Plaza Apartments, Central Delhi, New Delhi 110052
- **Zoom Level**: 13 (neighborhood level)
- **Map Style**: Custom clean styling with brand colors

## 🎨 Customization

### Change Location
Edit the coordinates in `src/components/GoogleMap.tsx`:
```typescript
const businessLocation = {
  lat: 28.6304,  // Your latitude
  lng: 77.2177   // Your longitude
};
```

### Update Business Info
Modify the info window content in the same file:
```typescript
const infoWindowContent = `
  <div style="padding: 12px;">
    <h3>Your Business Name</h3>
    <p>Your Address</p>
    // ... other details
  </div>
`;
```

### Styling
- Map styles are defined in the `styles` array
- Custom marker icon uses SVG for scalability
- CSS classes use Tailwind for consistent theming

## 💰 Cost Considerations
- Google Maps API has usage-based pricing
- First $200/month is free for most users
- Monitor usage in Google Cloud Console
- Set up billing alerts to avoid surprises

## 🔧 Troubleshooting

### Map Not Loading
1. Check if API key is correctly set in `.env.local`
2. Verify Maps JavaScript API is enabled
3. Check browser console for error messages
4. Ensure API key restrictions allow your domain

### Common Issues
- **Blank map**: Usually API key or billing issue
- **Gray map**: Check API restrictions and quotas
- **Console errors**: Verify all required APIs are enabled

## 📱 Mobile Optimization
- Map is fully responsive
- Touch gestures supported (pinch, zoom, pan)
- Info windows are mobile-friendly
- Quick action buttons for directions

## 🛡️ Security Best Practices
1. **Never commit API keys** to version control
2. **Use environment variables** for sensitive data
3. **Restrict API keys** to specific domains
4. **Monitor usage** regularly
5. **Set up quotas** to prevent abuse

## 📞 Support
If you encounter issues:
1. Check the [Google Maps API documentation](https://developers.google.com/maps/documentation)
2. Verify your billing account is active
3. Review quota limits and usage
4. Check the browser console for detailed error messages

---

**Note**: Remember to restart your development server after adding the API key to `.env.local`!
