# 🗺️ Google Maps Setup Instructions

## Quick Start

1. **Get Google Maps API Key:**
   - Visit: https://console.cloud.google.com/
   - Create a new project
   - Enable "Maps JavaScript API"
   - Create an API key

2. **Add API Key to Project:**
   - Open `.env.local` file
   - Replace `your_google_maps_api_key_here` with your actual API key

3. **Restart Development Server:**
   ```bash
   npm run dev
   ```

4. **Test the Map:**
   - Visit `/contact` page
   - You should see an interactive map of Central Delhi

## Features Added

✅ Interactive Google Map with Central Delhi location
✅ Custom red marker with business info
✅ Clickable info window with contact details
✅ Direct links to Google Maps for directions
✅ Responsive design for all devices
✅ Error handling if map fails to load
✅ Professional styling with your theme colors

## Location Details

- **Address**: 3252 Plaza Apartments, Central Delhi, New Delhi 110052
- **Coordinates**: 28.6304°N, 77.2177°E
- **Nearby Metro**: Rajiv Chowk (2 km away)

## Cost Information

- Google Maps API: $0.007 per map load
- First $200/month is FREE
- Current implementation is cost-optimized

## Security

- API key is stored in `.env.local` (never committed to Git)
- Recommend adding domain restrictions in Google Cloud Console
