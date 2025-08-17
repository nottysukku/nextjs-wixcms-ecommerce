"use client";

import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoading } from '@/context/loadingContext';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { isLoading: contextLoading, setLoadingWithDelay } = useLoading();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousUrlRef = useRef('');

  // Create full URL string to detect any changes
  const currentUrl = `${pathname}?${searchParams.toString()}`;

  // Handle initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1500);

    // Set initial URL
    previousUrlRef.current = currentUrl;

    return () => clearTimeout(timer);
  }, []);

  // Handle URL changes (pathname or search params)
  useEffect(() => {
    if (previousUrlRef.current && previousUrlRef.current !== currentUrl && !isInitialLoad) {
      console.log('🎭 URL changed:', previousUrlRef.current, '->', currentUrl);
      setLoadingWithDelay(1200);
    }

    previousUrlRef.current = currentUrl;
  }, [currentUrl, isInitialLoad, setLoadingWithDelay]);

  // Enhanced click detection for immediate feedback
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a, button[onclick], [role="button"], .product-card, .category-item');
      
      if (link) {
        // Check for anchor links
        const href = link.getAttribute('href');
        const onClick = link.getAttribute('onclick');
        
        // Handle anchor links
        if (href && href !== '#' && !href.startsWith('#') && !(link as HTMLAnchorElement).target) {
          try {
            const url = new URL(href, window.location.href);
            const currentLocation = new URL(window.location.href);
            
            // Trigger for internal navigation
            if (url.origin === currentLocation.origin && 
                (url.pathname !== currentLocation.pathname || url.search !== currentLocation.search)) {
              console.log('🖱️ Link clicked:', href);
              setLoadingWithDelay(1200);
            }
          } catch (error) {
            // Relative or invalid URL, might still be internal
            if (href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) {
              console.log('🖱️ Relative link clicked:', href);
              setLoadingWithDelay(1200);
            }
          }
        }
        
        // Handle buttons with navigation logic or product cards
        else if (onClick || link.classList.contains('product-card') || link.classList.contains('category-item')) {
          console.log('🖱️ Interactive element clicked');
          setLoadingWithDelay(1200);
        }
      }
    };

    document.addEventListener('click', handleLinkClick, { capture: true });

    return () => {
      document.removeEventListener('click', handleLinkClick, { capture: true });
    };
  }, [setLoadingWithDelay]);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      console.log('⬅️ Browser navigation (back/forward)');
      setLoadingWithDelay(1000);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setLoadingWithDelay]);

  const isActive = contextLoading || isInitialLoad;

  return (
    <>
      {/* Curtain Animation Overlay */}
      <div
        className={`fixed inset-0 z-[9999] transition-all duration-500 ${
          isActive
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Left Curtain Panel - Crimson/Red - Slides from LEFT to CENTER */}
        <div
          className={`absolute top-0 h-full transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            isActive ? 'left-0 w-1/2' : 'left-[-50%] w-1/2'
          }`}
          style={{
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 30%, #991b1b 60%, #7f1d1d 100%)',
            boxShadow: isActive ? '4px 0 30px rgba(220, 38, 38, 0.5)' : 'none',
            transform: isActive ? 'translateX(0)' : 'translateX(-100%)',
          }}
        >
          {/* Cloth-like animated patterns */}
          <div className="absolute inset-0 opacity-25">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent animate-pulse"></div>
            {/* Vertical curtain folds */}
            <div className="absolute inset-y-0 left-0 w-full">
              {Array.from({length: 8}).map((_, i) => (
                <div 
                  key={i}
                  className="absolute inset-y-0 bg-white/10 animate-pulse"
                  style={{
                    width: '2px',
                    left: `${12.5 * (i + 1)}%`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '2s'
                  }}
                ></div>
              ))}
            </div>
            {/* Horizontal texture lines */}
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-1/4 left-0 w-full h-0.5 bg-white/25 animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute top-2/4 left-0 w-full h-0.5 bg-white/20 animate-pulse" style={{animationDelay: '0.7s'}}></div>
              <div className="absolute top-3/4 left-0 w-full h-0.5 bg-white/25 animate-pulse" style={{animationDelay: '0.9s'}}></div>
            </div>
            {/* Edge highlight */}
            <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-white/30 via-white/40 to-white/30"></div>
          </div>
        </div>
        
        {/* Right Curtain Panel - Professional Blue - Slides from RIGHT to CENTER */}
        <div
          className={`absolute top-0 h-full transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            isActive ? 'right-0 w-1/2' : 'right-[-50%] w-1/2'
          }`}
          style={{
            background: 'linear-gradient(225deg, #1e40af 0%, #1d4ed8 30%, #2563eb 60%, #3b82f6 100%)',
            boxShadow: isActive ? '-4px 0 30px rgba(30, 64, 175, 0.5)' : 'none',
            transform: isActive ? 'translateX(0)' : 'translateX(100%)',
          }}
        >
          {/* Cloth-like animated patterns */}
          <div className="absolute inset-0 opacity-25">
            <div className="absolute inset-0 bg-gradient-to-bl from-white/20 to-transparent animate-pulse"></div>
            {/* Vertical curtain folds */}
            <div className="absolute inset-y-0 right-0 w-full">
              {Array.from({length: 8}).map((_, i) => (
                <div 
                  key={i}
                  className="absolute inset-y-0 bg-white/10 animate-pulse"
                  style={{
                    width: '2px',
                    right: `${12.5 * (i + 1)}%`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '2s'
                  }}
                ></div>
              ))}
            </div>
            {/* Horizontal texture lines */}
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-1/4 right-0 w-full h-0.5 bg-white/25 animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute top-2/4 right-0 w-full h-0.5 bg-white/20 animate-pulse" style={{animationDelay: '0.7s'}}></div>
              <div className="absolute top-3/4 right-0 w-full h-0.5 bg-white/25 animate-pulse" style={{animationDelay: '0.9s'}}></div>
            </div>
            {/* Edge highlight */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-white/30 via-white/40 to-white/30"></div>
          </div>
        </div>

        {/* Center Loading Content */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-600 ${
          isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <div className="text-center text-white relative">
            {/* Decorative background with red-blue gradient */}
            <div className="absolute inset-0 -m-20">
              <div className="w-40 h-40 mx-auto border-2 border-white/30 rounded-full animate-pulse"
                   style={{
                     background: 'linear-gradient(45deg, rgba(220,38,38,0.1) 0%, rgba(30,64,175,0.1) 100%)'
                   }}>
              </div>
              <div className="absolute inset-4 border border-white/20 rounded-full animate-ping"></div>
            </div>

            {/* Main content */}
            <div className="relative z-10">
              {/* Brand Logo Area */}
              <div className="mb-8">
                <div className="text-4xl font-bold tracking-wider mb-2">
                  {isInitialLoad ? '✨' : '🛍️'}
                </div>
                <div className="h-1 w-24 mx-auto bg-gradient-to-r from-red-400 via-white to-blue-400 rounded-full"></div>
              </div>

              {/* Professional Loading Spinner */}
              <div className="mb-8">
                <div className="relative w-24 h-24 mx-auto">
                  {/* Outer ring - Red */}
                  <div className="absolute inset-0 border-2 border-red-400/30 rounded-full"></div>
                  {/* Middle ring - White */}
                  <div className="absolute inset-2 border-2 border-white/40 rounded-full"></div>
                  {/* Spinning inner ring - Blue to Red gradient */}
                  <div 
                    className="absolute inset-4 border-3 border-transparent rounded-full animate-spin"
                    style={{
                      borderTopColor: '#dc2626',
                      borderRightColor: '#3b82f6',
                      borderBottomColor: 'transparent',
                      borderLeftColor: 'transparent'
                    }}>
                  </div>
                  {/* Center dot - Gradient */}
                  <div 
                    className="absolute inset-8 rounded-full animate-pulse"
                    style={{
                      background: 'linear-gradient(45deg, #dc2626, #3b82f6)'
                    }}>
                  </div>
                </div>
              </div>
              
              {/* Loading Text */}
              <div className="space-y-4">
                <h3 className="text-3xl font-bold tracking-wide">
                  {isInitialLoad ? 'Welcome to Nottysukkus' : 'Loading...'}
                </h3>
                
                {/* Progress bar with red-blue gradient */}
                <div className="w-48 h-2 mx-auto bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out" 
                    style={{ 
                      width: isInitialLoad ? '100%' : '70%',
                      background: 'linear-gradient(90deg, #dc2626 0%, #ffffff 50%, #3b82f6 100%)',
                      animation: 'shimmer 2s infinite'
                    }}
                  ></div>
                </div>
                
                <p className="text-lg opacity-90 font-medium">
                  {isInitialLoad 
                    ? 'Crafting your perfect shopping experience' 
                    : 'Preparing your page'}
                </p>

                {/* Animated dots with alternating colors */}
                <div className="flex justify-center space-x-3 mt-4">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top and bottom decorative lines with red-blue gradient */}
        <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-white/70 to-blue-600 transition-opacity duration-700 ${
          isActive ? 'opacity-100' : 'opacity-0'
        }`}></div>
        <div className={`absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-white/70 to-blue-600 transition-opacity duration-700 ${
          isActive ? 'opacity-100' : 'opacity-0'
        }`}></div>
      </div>

      {/* Page Content */}
      <div
        className={`transition-all duration-700 ease-out ${
          isActive
            ? 'opacity-0 scale-98 filter blur-sm'
            : 'opacity-100 scale-100 filter blur-0'
        }`}
      >
        {children}
      </div>
    </>
  );
};

export default PageTransition;
