"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import CartModal from "./CartModal";
import { useWixClient } from "@/hooks/useWixClient";
import Cookies from "js-cookie";
import { useCartStore } from "@/hooks/useCartStore";

const NavIcons = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathName = usePathname();

  const wixClient = useWixClient();
  const isLoggedIn = wixClient.auth.loggedIn();

  const handleProfile = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setIsProfileOpen((prev) => !prev);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    Cookies.remove("refreshToken");
    const { logoutUrl } = await wixClient.auth.logout(window.location.href);
    setIsLoading(false);
    setIsProfileOpen(false);
    router.push(logoutUrl);
  };

  const { cart, counter, getCart } = useCartStore();

  // Debug logging for cart state
  console.log("🛍️ NavIcons cart state:", { 
    counter, 
    cartExists: !!cart,
    lineItemsCount: cart?.lineItems?.length 
  });

  useEffect(() => {
    getCart(wixClient);
  }, [wixClient, getCart]);

  // Click outside detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      <div ref={profileRef} className="relative">
        <Image
          src="/profile.png"
          alt=""
          width={22}
          height={22}
          className="cursor-pointer dark:invert dark:brightness-0 dark:filter transition-all duration-200"
          onClick={handleProfile}
        />
        {isProfileOpen && (
          <div className="absolute p-4 rounded-md top-12 left-0 bg-white dark:bg-secondary-800 text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:shadow-[0_3px_10px_rgb(255,255,255,0.1)] z-20 text-secondary-900 dark:text-secondary-100 min-w-32">
            <Link href="/profile" className="block hover:text-primary-600 dark:hover:text-primary-400">Profile</Link>
            <div className="mt-2 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400" onClick={handleLogout}>
              {isLoading ? "Logging out" : "Logout"}
            </div>
          </div>
        )}
      </div>

      <Image
        src="/notification.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer dark:invert dark:brightness-0 dark:filter transition-all duration-200"
      />

      <div ref={cartRef} className="relative">
        <div
          className="relative cursor-pointer"
          onClick={() => setIsCartOpen((prev) => !prev)}
        >
          <Image 
            src="/cart.png" 
            alt="" 
            width={22} 
            height={22} 
            className="dark:invert dark:brightness-0 dark:filter transition-all duration-200"
          />
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-sukku rounded-full text-white text-xs flex items-center justify-center font-bold">
            {counter}
          </div>
        </div>
        {isCartOpen && <CartModal />}
      </div>
    </div>
  );
};

export default NavIcons;
