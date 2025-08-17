"use client";

import { useEffect, useRef, useState } from 'react';

const CursorStardust = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Direct DOM manipulation for better performance
    const updateCursor = (x: number, y: number) => {
      cursor.style.transform = `translate3d(${x - 16}px, ${y - 16}px, 0)`;
    };

    // Optimized mouse move handler with throttling
    let lastUpdate = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastUpdate > 8) { // ~120fps throttling
        updateCursor(e.clientX, e.clientY);
        setIsVisible(true);
        lastUpdate = now;
      }
    };

    // Simple click handlers
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Add event listeners with passive flag for better performance
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <>
      {/* Optimized cursor hiding - only target body to avoid cascading */}
      <style jsx global>{`
        body {
          cursor: none !important;
        }
      `}</style>

      {/* Simplified Custom Cursor */}
      <div
        ref={cursorRef}
        className={`fixed pointer-events-none z-[10000] w-6 h-6 transition-opacity duration-150 will-change-transform ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: 0,
          top: 0,
        }}
      >
        {/* Single optimized cursor element */}
        <div
          className={`w-full h-full rounded-full border transition-all duration-150 ${
            isClicking 
              ? 'border-red-500 scale-125 bg-red-500/10' 
              : 'border-blue-500/70 scale-100 bg-blue-500/5'
          }`}
        >
          {/* Simple center dot */}
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150 ${
              isClicking 
                ? 'w-1.5 h-1.5 bg-red-500' 
                : 'w-1 h-1 bg-blue-500'
            }`}
          />
        </div>
      </div>
    </>
  );
};

export default CursorStardust;
