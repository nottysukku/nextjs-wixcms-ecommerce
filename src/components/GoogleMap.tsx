"use client";

import { useEffect, useRef, useState } from 'react';

interface GoogleMapProps {
  className?: string;
}

const GoogleMap = ({ className = "" }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Load Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      initializeMap();
    };
    
    script.onerror = () => {
      setError('Failed to load Google Maps API');
    };
    
    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    try {
      // New Delhi coordinates (centered on Central Delhi)
      const newDelhiCenter = {
        lat: 28.6139,
        lng: 77.2090
      };

      // Business location (Central Delhi area)
      const businessLocation = {
        lat: 28.6304,
        lng: 77.2177
      };

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 13,
        center: businessLocation,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: "all",
            elementType: "geometry.fill",
            stylers: [{ weight: "2.00" }]
          },
          {
            featureType: "all",
            elementType: "geometry.stroke",
            stylers: [{ color: "#9c9c9c" }]
          },
          {
            featureType: "all",
            elementType: "labels.text",
            stylers: [{ visibility: "on" }]
          },
          {
            featureType: "landscape",
            elementType: "all",
            stylers: [{ color: "#f2f2f2" }]
          },
          {
            featureType: "landscape",
            elementType: "geometry.fill",
            stylers: [{ color: "#ffffff" }]
          },
          {
            featureType: "landscape.man_made",
            elementType: "geometry.fill",
            stylers: [{ color: "#ffffff" }]
          },
          {
            featureType: "poi",
            elementType: "all",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "road",
            elementType: "all",
            stylers: [{ saturation: -100 }, { lightness: 45 }]
          },
          {
            featureType: "road",
            elementType: "geometry.fill",
            stylers: [{ color: "#eeeeee" }]
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#7b7b7b" }]
          },
          {
            featureType: "road",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#ffffff" }]
          },
          {
            featureType: "road.highway",
            elementType: "all",
            stylers: [{ visibility: "simplified" }]
          },
          {
            featureType: "road.arterial",
            elementType: "labels.icon",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "transit",
            elementType: "all",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "water",
            elementType: "all",
            stylers: [{ color: "#46bcec" }, { visibility: "on" }]
          },
          {
            featureType: "water",
            elementType: "geometry.fill",
            stylers: [{ color: "#c8d7d4" }]
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#070707" }]
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#ffffff" }]
          }
        ],
        streetViewControl: true,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });

      // Create custom marker icon
      const markerIcon = {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 0C8.954 0 0 8.954 0 20c0 14.359 18.054 29.42 18.584 29.88a1.5 1.5 0 0 0 2.832 0C21.946 49.42 40 34.359 40 20 40 8.954 31.046 0 20 0z" fill="#dc2626"/>
            <circle cx="20" cy="20" r="8" fill="white"/>
            <circle cx="20" cy="20" r="4" fill="#dc2626"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(40, 50),
        anchor: new window.google.maps.Point(20, 50)
      };

      // Add marker for business location
      const marker = new window.google.maps.Marker({
        position: businessLocation,
        map: map,
        title: 'Nottysukkus - Central Delhi',
        icon: markerIcon,
        animation: window.google.maps.Animation.DROP,
      });

      // Info window content
      const infoWindowContent = `
        <div style="padding: 12px; font-family: Arial, sans-serif; max-width: 300px;">
          <h3 style="margin: 0 0 8px 0; color: #dc2626; font-size: 18px; font-weight: bold;">
            🛍️ Nottysukkus
          </h3>
          <p style="margin: 4px 0; color: #374151; font-size: 14px;">
            <strong>📍 Address:</strong><br>
            3252 Plaza Apartments<br>
            Central Delhi, New Delhi 110052<br>
            India
          </p>
          <p style="margin: 4px 0; color: #374151; font-size: 14px;">
            <strong>📞 Phone:</strong> <a href="tel:+919560760057" style="color: #dc2626;">+91 9560760057</a>
          </p>
          <p style="margin: 4px 0; color: #374151; font-size: 14px;">
            <strong>✉️ Email:</strong> <a href="mailto:sukritchopra2003@gmail.com" style="color: #dc2626;">sukritchopra2003@gmail.com</a>
          </p>
          <p style="margin: 8px 0 4px 0; color: #374151; font-size: 14px;">
            <strong>🕒 Business Hours:</strong><br>
            Monday - Friday: 9:00 AM - 6:00 PM<br>
            Saturday: 10:00 AM - 4:00 PM<br>
            Sunday: Closed
          </p>
          <div style="margin-top: 12px; text-align: center;">
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=28.6304,77.2177" 
              target="_blank" 
              rel="noopener noreferrer"
              style="
                display: inline-block;
                background-color: #dc2626;
                color: white;
                padding: 8px 16px;
                text-decoration: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: bold;
                transition: background-color 0.2s;
              "
              onmouseover="this.style.backgroundColor='#b91c1c'"
              onmouseout="this.style.backgroundColor='#dc2626'"
            >
              🧭 Get Directions
            </a>
          </div>
        </div>
      `;

      const infoWindow = new window.google.maps.InfoWindow({
        content: infoWindowContent
      });

      // Show info window on marker click
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      // Auto-open info window after 2 seconds
      setTimeout(() => {
        infoWindow.open(map, marker);
      }, 2000);

      setIsLoaded(true);
    } catch (err) {
      setError('Failed to initialize Google Maps');
      console.error('Google Maps initialization error:', err);
    }
  };

  if (error) {
    return (
      <div className={`bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 rounded-xl p-8 text-center ${className}`}>
        <div className="text-4xl mb-4">🗺️</div>
        <h3 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">Map Unavailable</h3>
        <p className="text-red-600 dark:text-red-500 mb-4">{error}</p>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-left max-w-sm mx-auto">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">📍 Our Location:</h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            3252 Plaza Apartments<br />
            Central Delhi, New Delhi 110052<br />
            India
          </p>
          <a 
            href="https://www.google.com/maps/search/?api=1&query=Central+Delhi+New+Delhi+110052+India"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            View on Google Maps
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapRef} 
        className="w-full h-full min-h-[400px] rounded-xl overflow-hidden shadow-lg"
        style={{ minHeight: '400px' }}
      />
      
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950/30 dark:to-secondary-950/30 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Loading Map...</h3>
            <p className="text-gray-600 dark:text-gray-400">Initializing Google Maps</p>
          </div>
        </div>
      )}
      
      {/* Map Controls Info */}
      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-600 dark:text-gray-400">
        <p>🖱️ Click marker for details • 🧭 Drag to explore</p>
      </div>
    </div>
  );
};

// Extend Window interface to include Google Maps
declare global {
  interface Window {
    google: any;
  }
}

export default GoogleMap;
