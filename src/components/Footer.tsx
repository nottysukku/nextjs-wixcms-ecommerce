import Image from "next/image";
import Link from "next/link";
import Copyright from "./Copyright";

const Footer = () => {
  return (
    <div className="py-24 px-4 md:px-8 lg:px-16 xl:32 2xl:px-64 bg-secondary-100 dark:bg-secondary-800 text-sm mt-24 transition-colors duration-300">
      {/* TOP */}
      <div className="flex flex-col md:flex-row justify-between gap-24">
        {/* LEFT */}
        <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8">
          <Link href="/">
            <div className="text-2xl tracking-wide font-bold text-primary-600 dark:text-primary-400">SUKKU</div>
          </Link>
          <p className="text-secondary-600 dark:text-secondary-400">
            3252 Plaza Apartments, Central Delhi, New Delhi 110052, India
          </p>
          <span className="font-semibold text-secondary-700 dark:text-secondary-300">sukritchopra2003@gmail.com</span>
          <span className="font-semibold text-secondary-700 dark:text-secondary-300">+91 9560760057</span>
          <div className="flex gap-6">
            <Link href="/about" className="hover:scale-110 transition-transform">
              <Image src="/facebook.png" alt="Facebook" width={16} height={16} className="opacity-70 hover:opacity-100 transition-opacity" />
            </Link>
            <Link href="/about" className="hover:scale-110 transition-transform">
              <Image src="/instagram.png" alt="Instagram" width={16} height={16} className="opacity-70 hover:opacity-100 transition-opacity" />
            </Link>
            <Link href="/about" className="hover:scale-110 transition-transform">
              <Image src="/youtube.png" alt="YouTube" width={16} height={16} className="opacity-70 hover:opacity-100 transition-opacity" />
            </Link>
            <Link href="/about" className="hover:scale-110 transition-transform">
              <Image src="/pinterest.png" alt="Pinterest" width={16} height={16} className="opacity-70 hover:opacity-100 transition-opacity" />
            </Link>
            <Link href="/about" className="hover:scale-110 transition-transform">
              <Image src="/x.png" alt="X (Twitter)" width={16} height={16} className="opacity-70 hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>
        {/* CENTER */}
        <div className="hidden lg:flex justify-between w-1/2">
          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-lg text-secondary-800 dark:text-secondary-200">COMPANY</h1>
            <div className="flex flex-col gap-6">
              <Link href="/about" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About Us</Link>
              <Link href="/about" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Careers</Link>
              <Link href="/about" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Affiliates</Link>
              <Link href="/about" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Blog</Link>
              <Link href="/contact" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contact Us</Link>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-lg text-secondary-800 dark:text-secondary-200">SHOP</h1>
            <div className="flex flex-col gap-6">
              <Link href="/shop?sort=asc lastUpdated" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">New Arrivals</Link>
              <Link href="/shop?name=accessories" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Accessories</Link>
              <Link href="/shop?name=men" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Men</Link>
              <Link href="/shop?name=women" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Women</Link>
              <Link href="/shop" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">All Products</Link>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-lg text-secondary-800 dark:text-secondary-200">HELP</h1>
            <div className="flex flex-col gap-6">
              <Link href="/contact" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Customer Service</Link>
              <Link href="/profile" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">My Account</Link>
              <Link href="/contact" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Find a Store</Link>
              <Link href="/about" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Legal & Privacy</Link>
              <Link href="/deals" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Gift Card</Link>
            </div>
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8">
          <h1 className="font-medium text-lg text-secondary-800 dark:text-secondary-200">SUBSCRIBE</h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Be the first to get the latest news about trends, promotions, and
            much more!
          </p>
          <div className="flex">
            <input
              type="text"
              placeholder="Email address"
              className="p-4 w-3/4 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-secondary-100 placeholder-secondary-500 dark:placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
            <button className="w-1/4 bg-primary-600 hover:bg-primary-700 text-white transition-colors">JOIN</button>
          </div>
          <span className="font-semibold text-secondary-700 dark:text-secondary-300">Secure Payments</span>
          <div className="flex justify-between">
            <Image src="/discover.png" alt="Discover Card" width={40} height={20} className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer" />
            <Image src="/skrill.png" alt="Skrill" width={40} height={20} className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer" />
            <Image src="/paypal.png" alt="PayPal" width={40} height={20} className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer" />
            <Image src="/mastercard.png" alt="Mastercard" width={40} height={20} className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer" />
            <Image src="/visa.png" alt="Visa" width={40} height={20} className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer" />
          </div>
        </div>
      </div>
      {/* BOTTOM */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-16 pt-8 border-t border-secondary-300 dark:border-secondary-600">
        <Copyright />
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="text-secondary-600 dark:text-secondary-400">
            <span className="text-secondary-500 dark:text-secondary-500 mr-4">Language</span>
            <span className="font-medium text-secondary-700 dark:text-secondary-300">India | English</span>
          </div>
          <div className="text-secondary-600 dark:text-secondary-400">
            <span className="text-secondary-500 dark:text-secondary-500 mr-4">Currency</span>
            <span className="font-medium text-secondary-700 dark:text-secondary-300">₹ INR</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
