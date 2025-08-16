import Link from "next/link";
import Menu from "./Menu";
import Image from "next/image";
import SearchBar from "./SearchBar";
import dynamic from "next/dynamic";

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
  return (
    <div className="h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative bg-white dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-700 transition-colors duration-300">
      {/* MOBILE */}
      <div className="h-full flex items-center justify-between md:hidden">
        <Link href="/">
          <div className="text-2xl tracking-wide font-bold text-primary-600 dark:text-primary-400">SUKKU</div>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Menu />
        </div>
      </div>
      {/* BIGGER SCREENS */}
      <div className="hidden md:flex items-center justify-between gap-8 h-full">
        {/* LEFT */}
        <div className="w-1/3 xl:w-1/2 flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="" width={24} height={24} />
            <div className="text-2xl tracking-wide font-bold text-primary-600 dark:text-primary-400">SUKKU</div>
          </Link>
          <div className="hidden xl:flex gap-4">
            <Link href="/" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Homepage</Link>
            <Link href="/" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Shop</Link>
            <Link href="/" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Deals</Link>
            <Link href="/" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About</Link>
            <Link href="/" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contact</Link>
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-2/3 xl:w-1/2 flex items-center justify-between gap-8">
          <SearchBar />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <NavIcons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
