"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const LoadingBar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // Reset progress when route changes
    setProgress(0);
    setIsLoading(true);

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prevProgress + Math.random() * 30;
      });
    }, 200);

    // Complete loading after a delay
    const completeTimeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 300);
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(completeTimeout);
    };
  }, [pathname]);

  if (!isLoading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-50">
      <div
        className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 ease-out shadow-lg"
        style={{
          width: `${progress}%`,
          boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
        }}
      />
    </div>
  );
};

export default LoadingBar;
