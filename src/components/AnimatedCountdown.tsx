"use client";

import { useState, useEffect } from 'react';

interface TimeUnit {
  value: number;
  label: string;
}

interface AnimatedCountdownProps {
  targetDate?: Date;
  className?: string;
}

const AnimatedCountdown: React.FC<AnimatedCountdownProps> = ({ 
  targetDate,
  className = "" 
}) => {
  // Default to 7 days from now if no target date provided
  const defaultTargetDate = new Date();
  defaultTargetDate.setDate(defaultTargetDate.getDate() + 7);
  
  const endDate = targetDate || defaultTargetDate;
  const [mounted, setMounted] = useState(false);

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [previousTime, setPreviousTime] = useState(timeLeft);

  const calculateTimeLeft = () => {
    try {
      const difference = endDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    } catch (error) {
      console.error('Error calculating time left:', error);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Initialize immediately
    const initialTime = calculateTimeLeft();
    setTimeLeft(initialTime);
    setPreviousTime(initialTime);

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(prevTime => {
        setPreviousTime(prevTime);
        return newTimeLeft;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mounted]); // Only depend on mounted state

  const TimeBlock: React.FC<{ 
    value: number; 
    label: string; 
    previousValue: number;
  }> = ({ value, label, previousValue }) => {
    const hasChanged = value !== previousValue && previousValue !== undefined;

    return (
      <div className={`bg-primary-100 dark:bg-primary-900/30 rounded-lg p-4 min-w-16 relative transition-all duration-300 ${
        hasChanged ? 'scale-105 ring-2 ring-primary-300 dark:ring-primary-600' : ''
      }`}>
        <div className="relative">
          <div 
            className={`text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 transition-all duration-500 ${
              hasChanged ? 'text-primary-700 dark:text-primary-300' : ''
            }`}
          >
            {String(value).padStart(2, '0')}
          </div>
        </div>
        
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-semibold tracking-wider">
          {label}
        </div>
        
        {/* Subtle glow effect when changing */}
        {hasChanged && (
          <div className="absolute inset-0 bg-primary-200/30 dark:bg-primary-600/20 rounded-lg animate-pulse pointer-events-none"></div>
        )}
      </div>
    );
  };

  // Show loading state during hydration
  if (!mounted) {
    return (
      <div className={`bg-white dark:bg-secondary-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            ⏰ Sale Ends Soon!
          </h3>
          <div className="flex justify-center space-x-4 md:space-x-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-primary-100 dark:bg-primary-900/30 rounded-lg p-4 min-w-16 animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Check if countdown has ended
  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  if (isExpired) {
    return (
      <div className={`bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-xl font-bold mb-2">Sale Has Ended!</h3>
          <p className="text-sm opacity-90">Don&apos;t worry, we&apos;ll have more amazing deals soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-secondary-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          ⏰ Sale Ends Soon!
        </h3>
        
        {/* Countdown Display */}
        <div className="flex justify-center space-x-4 md:space-x-8 mb-4">
          <TimeBlock 
            value={timeLeft.days} 
            label="DAYS" 
            previousValue={previousTime.days}
          />
          <TimeBlock 
            value={timeLeft.hours} 
            label="HOURS" 
            previousValue={previousTime.hours}
          />
          <TimeBlock 
            value={timeLeft.minutes} 
            label="MINS" 
            previousValue={previousTime.minutes}
          />
          <TimeBlock 
            value={timeLeft.seconds} 
            label="SECS" 
            previousValue={previousTime.seconds}
          />
        </div>

        {/* Progress bar showing time remaining */}
        <div className="max-w-md mx-auto">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-1000 relative overflow-hidden"
              style={{
                width: `${Math.max(5, Math.min(100, ((timeLeft.days * 24 + timeLeft.hours) / (7 * 24)) * 100))}%`
              }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {timeLeft.days > 0 ? `${timeLeft.days} days left` : 
             timeLeft.hours > 0 ? `${timeLeft.hours} hours left` :
             timeLeft.minutes > 0 ? `${timeLeft.minutes} minutes left` :
             `${timeLeft.seconds} seconds left`}
          </div>
        </div>
        
        {/* Urgency indicators */}
        {timeLeft.days === 0 && timeLeft.hours <= 1 && (
          <div className="mt-4 animate-bounce">
            <div className="text-red-500 font-bold text-sm">
              🚨 FINAL HOUR - HURRY UP!
            </div>
          </div>
        )}
        
        {timeLeft.days === 0 && timeLeft.hours <= 6 && timeLeft.hours > 1 && (
          <div className="mt-4">
            <div className="text-orange-500 font-semibold text-sm">
              ⚡ Less than 6 hours left!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimatedCountdown;
