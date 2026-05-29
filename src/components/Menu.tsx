"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useWixClient } from "@/hooks/useWixClient";
import { useCartStore } from "@/hooks/useCartStore";

const Menu = () => {
  const [open, setOpen] = useState(false);

  const wixClient = useWixClient();
  const { cart, counter, getCart } = useCartStore();
  const isLoggedIn = wixClient.auth.loggedIn();

  useEffect(() => {
    getCart(wixClient);
  }, [wixClient, getCart]);

  // Handle body scroll locking when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <div className="">
      {/* Hamburger Icon */}
      <button
        onClick={() => setOpen(true)}
        className="p-1 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors focus:outline-none"
        aria-label="Open Menu"
      >
        <Image
          src="/menu.png"
          alt="Menu"
          width={24}
          height={24}
          className="cursor-pointer dark:invert dark:brightness-0 dark:filter transition-all duration-200"
        />
      </button>

      {/* Slide-in Menu Drawer Overlay & Container */}
      {open && (
        <div className="fixed inset-0 z-[10000] flex">
          {/* Style Injector for self-contained premium animations */}
          <style>{`
            @keyframes overlayFadeIn {
              from { opacity: 0; }
              to { opacity: 0.6; }
            }
            @keyframes drawerSlideIn {
              from { transform: translateX(-100%); }
              to { transform: translateX(0); }
            }
            .animate-overlay {
              animation: overlayFadeIn 0.25s ease-out forwards;
            }
            .animate-drawer {
              animation: drawerSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>

          {/* Dark Overlay Background */}
          <div
            className="fixed inset-0 bg-black animate-overlay backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Sidebar Drawer */}
          <div className="relative flex flex-col w-80 max-w-[85vw] h-full bg-white dark:bg-secondary-950 text-secondary-900 dark:text-secondary-100 shadow-2xl animate-drawer z-10 overflow-hidden">
            {/* Header: Amazon style with brand gradient */}
            <div className="flex items-center gap-4 px-6 py-8 bg-gradient-to-r from-primary-600 to-amber-500 text-white border-b border-secondary-100 dark:border-secondary-900">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 border border-white/30 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold leading-tight">
                  {isLoggedIn ? "Hello, User!" : "Hello, Sign In"}
                </h2>
                <Link
                  href={isLoggedIn ? "/profile" : "/login"}
                  onClick={() => setOpen(false)}
                  className="text-xs text-white/90 hover:underline flex items-center gap-1 mt-0.5"
                >
                  {isLoggedIn ? "Manage Profile" : "Sign in to your account"} &rsaquo;
                </Link>
              </div>
              
              {/* Close Button Inside Header */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Links Scroll Body */}
            <div className="flex-1 overflow-y-auto py-6 px-6 space-y-8">
              {/* Section 1: Shop By Category */}
              <div>
                <h3 className="text-xs font-bold text-secondary-400 dark:text-secondary-500 uppercase tracking-widest mb-4">
                  Shop by Department
                </h3>
                <nav className="flex flex-col gap-3">
                  <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between text-base font-semibold py-1.5 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <span>Home</span>
                    <span className="text-secondary-300">&rsaquo;</span>
                  </Link>
                  <Link
                    href="/shop"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between text-base font-semibold py-1.5 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <span>Shop All Products</span>
                    <span className="text-secondary-300">&rsaquo;</span>
                  </Link>
                  <Link
                    href="/deals"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between text-base font-semibold py-1.5 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <span>Deals & Offers</span>
                    <span className="text-secondary-300">&rsaquo;</span>
                  </Link>
                </nav>
              </div>

              {/* Section 2: Account Settings */}
              <div className="border-t border-secondary-100 dark:border-secondary-900 pt-6">
                <h3 className="text-xs font-bold text-secondary-400 dark:text-secondary-500 uppercase tracking-widest mb-4">
                  Help & Settings
                </h3>
                <nav className="flex flex-col gap-3">
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between text-base font-semibold py-1.5 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <span>Your Profile</span>
                    <span className="text-secondary-300">&rsaquo;</span>
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between text-base font-semibold py-1.5 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <span>About Our Company</span>
                    <span className="text-secondary-300">&rsaquo;</span>
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between text-base font-semibold py-1.5 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <span>Contact Customer Support</span>
                    <span className="text-secondary-300">&rsaquo;</span>
                  </Link>
                  <Link
                    href={isLoggedIn ? "/profile" : "/login"}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between text-base font-semibold py-1.5 text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    <span>{isLoggedIn ? "Logout Account" : "Sign In / Register"}</span>
                  </Link>
                </nav>
              </div>
            </div>

            {/* Bottom Footer Credits */}
            <div className="p-6 border-t border-secondary-100 dark:border-secondary-900 bg-secondary-50 dark:bg-secondary-900/50 text-center text-xs text-secondary-400 dark:text-secondary-500 font-medium">
              &copy; {new Date().getFullYear()} SUKKU Store. Delhi, India.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
