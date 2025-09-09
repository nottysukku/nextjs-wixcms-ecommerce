"use client";

import Link from "next/link";
import Menu from "./Menu";
import Image from "next/image";
import SearchBar from "./SearchBar";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import CartModal from "./CartModal";
import { useWixClient } from "@/hooks/useWixClient";
import { useCartStore } from "@/hooks/useCartStore";

// Dynamically import components that use client-side hooks
const NavIcons = dynamic(() => import("./NavIcons"), { ssr: false });
const ThemeToggle = dynamic(() => import('./ThemeToggle'), {
  ssr: false,
  loading: () => (
    <div className="relative p-2 rounded-full bg-secondary-100 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-600 w-9 h-9">
      <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse"></div>
    </div>
  )
});

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const wixClient = useWixClient();
  const { cart, counter, getCart } = useCartStore();

  useEffect(() => {
    if (wixClient) {
      getCart(wixClient);
    }
  }, [wixClient, getCart]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let scrollEndTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Set scrolling state
      setIsScrolling(true);
      clearTimeout(scrollEndTimeout);
      
      // Clear existing timeout
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        const scrollDelta = currentScrollY - lastScrollY;
        
        // Always show at the very top
        if (currentScrollY <= 20) {
          if (!isVisible) {
            setIsVisible(true);
          }
        }
        // Hide when scrolling down past 100px
        else if (scrollDelta > 5 && currentScrollY > 100) {
          if (isVisible) {
            setIsVisible(false);
          }
        }
        // Show when scrolling up
        else if (scrollDelta < -5) {
          if (!isVisible) {
            setIsVisible(true);
          }
        }
        
        setLastScrollY(currentScrollY);
      }, 10);
      
      // Reset scrolling state after scroll ends
      scrollEndTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
      clearTimeout(scrollEndTimeout);
    };
  }, [lastScrollY, isVisible]);

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 bg-white dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-700 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95"
      style={{
        transform: isVisible ? 'translateY(0px)' : 'translateY(-100%)',
        transition: isScrolling 
          ? 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
          : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        willChange: 'transform',
        boxShadow: !isVisible ? 'none' : '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
      }}
    >
      {/* MOBILE */}
      <div className="h-full flex items-center justify-between md:hidden">
        <Link href="/">
          <div 
            className="text-2xl tracking-wide font-bold text-primary-600 dark:text-primary-400 transition-all duration-200"
            style={{
              opacity: isVisible ? 1 : 0.8,
              transform: isVisible ? 'scale(1)' : 'scale(0.95)'
            }}
          >
            SUKKU
          </div>
        </Link>
        <div 
          className="flex items-center gap-3"
          style={{
            opacity: isVisible ? 1 : 0.9,
            transform: isVisible ? 'translateX(0)' : 'translateX(5px)',
            transition: 'all 0.3s ease-out'
          }}
        >
          {/* Mobile Cart Icon */}
          <div
            className="relative cursor-pointer transform transition-transform duration-200 hover:scale-110"
            onClick={() => setIsCartOpen((prev) => !prev)}
          >
            <Image 
              src="/cart.png" 
              alt="Cart" 
              width={20} 
              height={20} 
              className="dark:invert dark:brightness-0 dark:filter transition-all duration-200"
            />
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-sukku rounded-full text-white text-xs flex items-center justify-center transform transition-transform duration-200 hover:scale-110">
              {counter}
            </div>
          </div>
          <ThemeToggle />
          <Menu />
        </div>
      </div>
      
      {/* BIGGER SCREENS */}
      <div className="hidden md:flex items-center justify-between gap-8 h-full">
        {/* LEFT */}
        <div 
          className="w-1/3 xl:w-1/2 flex items-center gap-12"
          style={{
            opacity: isVisible ? 1 : 0.9,
            transform: isVisible ? 'translateX(0)' : 'translateX(-10px)',
            transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          <Link href="/" className="flex items-center gap-3 group">
            <Image 
              src="/logo.png" 
              alt="" 
              width={24} 
              height={24} 
              className="transition-transform duration-200 group-hover:scale-110"
            />
            <div className="text-2xl tracking-wide font-bold text-primary-600 dark:text-primary-400 transition-all duration-200 group-hover:scale-105">
              SUKKU
            </div>
          </Link>
          <div className="hidden xl:flex gap-4">
            <Link 
              href="/" 
              className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-600 dark:after:bg-primary-400 after:transition-all after:duration-200 hover:after:w-full"
            >
              Homepage
            </Link>
            <Link 
              href="/shop" 
              className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-600 dark:after:bg-primary-400 after:transition-all after:duration-200 hover:after:w-full"
            >
              Shop
            </Link>
            <Link 
              href="/deals" 
              className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-600 dark:after:bg-primary-400 after:transition-all after:duration-200 hover:after:w-full"
            >
              Deals
            </Link>
            <Link 
              href="/about" 
              className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-600 dark:after:bg-primary-400 after:transition-all after:duration-200 hover:after:w-full"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-600 dark:after:bg-primary-400 after:transition-all after:duration-200 hover:after:w-full"
            >
              Contact
            </Link>
          </div>
        </div>
        
        {/* RIGHT */}
        <div 
          className="w-2/3 xl:w-1/2 flex items-center justify-between gap-8"
          style={{
            opacity: isVisible ? 1 : 0.9,
            transform: isVisible ? 'translateX(0)' : 'translateX(10px)',
            transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          <SearchBar />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <NavIcons />
          </div>
        </div>
      </div>
      
      {/* Cart Modal with enhanced animation */}
      <div
        style={{
          opacity: isCartOpen ? 1 : 0,
          transform: isCartOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
          transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          pointerEvents: isCartOpen ? 'auto' : 'none'
        }}
      >
        {isCartOpen && <CartModal />}
      </div>
    </div>
  );
};

export default Navbar;