"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import CartModal from "./CartModal";
import { useWixClient } from "@/hooks/useWixClient";
import { useCartStore } from "@/hooks/useCartStore";

const Menu = () => {
  const [open, setOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const wixClient = useWixClient();
  const { cart, counter, getCart } = useCartStore();

  useEffect(() => {
    getCart(wixClient);
  }, [wixClient, getCart]);

  return (
    <div className="">
      <Image
        src="/menu.png"
        alt=""
        width={28}
        height={28}
        className="cursor-pointer dark:invert dark:brightness-0 dark:filter transition-all duration-200"
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className="absolute bg-black dark:bg-secondary-900 text-white left-0 top-20 w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-8 text-xl z-10">
          <Link href="/" onClick={() => setOpen(false)}>Homepage</Link>
          <Link href="/shop" onClick={() => setOpen(false)}>Shop</Link>
          <Link href="/deals" onClick={() => setOpen(false)}>Deals</Link>
          <Link href="/about" onClick={() => setOpen(false)}>About</Link>
          <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
          <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
          <Link href="/profile" onClick={() => setOpen(false)}>Profile</Link>
          
          {/* Cart Link for Mobile */}
          <div
            className="relative cursor-pointer flex items-center gap-2 hover:text-sukku transition-colors"
            onClick={() => {
              setIsCartOpen((prev) => !prev);
              setOpen(false);
            }}
          >
            <Image 
              src="/cart.png" 
              alt="Cart" 
              width={24} 
              height={24} 
              className="invert brightness-0 filter"
            />
            <span>Cart</span>
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-sukku rounded-full text-white text-xs flex items-center justify-center">
              {counter}
            </div>
          </div>
        </div>
      )}
      {isCartOpen && <CartModal />}
    </div>
  );
};

export default Menu;
