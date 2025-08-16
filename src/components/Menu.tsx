"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Menu = () => {
  const [open, setOpen] = useState(false);

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
        </div>
      )}
    </div>
  );
};

export default Menu;
