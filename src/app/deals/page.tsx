import ProductList from "@/components/ProductList";
import { wixClientServer } from "@/lib/wixClientServer";
import Link from "next/link";
import { Suspense } from "react";

const DealsPage = async ({ searchParams }: { searchParams: any }) => {
  const wixClient = await wixClientServer();

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative min-h-screen bg-white dark:bg-secondary-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-50 via-primary-50 to-orange-50 dark:from-red-950/50 dark:via-primary-950 dark:to-orange-950/50 rounded-2xl p-8 md:p-12 mb-12 mt-8 relative overflow-hidden">
        <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
          LIMITED TIME!
        </div>
        <div className="text-center relative z-10">
          <div className="text-primary-600 dark:text-primary-400 font-bold text-lg mb-2">🔥 HOT DEALS</div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Massive Sale Event
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Don&apos;t miss out on our biggest sale of the year! Up to 70% off on selected items. 
            Limited stock available - grab your favorites before they&apos;re gone!
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="bg-primary-600 text-white rounded-lg px-6 py-3 font-bold text-lg">
              UP TO 70% OFF
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg px-6 py-3 font-bold text-lg">
              FREE SHIPPING
            </div>
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-lg p-6 mb-12 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            ⏰ Sale Ends Soon!
          </h3>
          <div className="flex justify-center space-x-4 md:space-x-8">
            <div className="bg-primary-100 dark:bg-primary-900/30 rounded-lg p-4 min-w-16">
              <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">23</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">DAYS</div>
            </div>
            <div className="bg-primary-100 dark:bg-primary-900/30 rounded-lg p-4 min-w-16">
              <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">14</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">HOURS</div>
            </div>
            <div className="bg-primary-100 dark:bg-primary-900/30 rounded-lg p-4 min-w-16">
              <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">27</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">MINS</div>
            </div>
            <div className="bg-primary-100 dark:bg-primary-900/30 rounded-lg p-4 min-w-16">
              <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">42</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">SECS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Deal Categories */}
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
          🎯 Deal Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/shop?sort=desc price" className="group">
            <div className="bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300 border border-red-200 dark:border-red-800">
              <div className="text-4xl mb-3">💥</div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Flash Sales</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Up to 70% off</p>
              <div className="mt-3 text-red-500 font-semibold text-sm group-hover:text-red-600">Shop Now →</div>
            </div>
          </Link>
          
          <Link href="/shop?type=digital" className="group">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300 border border-blue-200 dark:border-blue-800">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Digital Deals</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">50% off digital items</p>
              <div className="mt-3 text-blue-500 font-semibold text-sm group-hover:text-blue-600">Shop Now →</div>
            </div>
          </Link>

          <Link href="/shop?max=1000" className="group">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300 border border-green-200 dark:border-green-800">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Budget Buys</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Under ₹1000</p>
              <div className="mt-3 text-green-500 font-semibold text-sm group-hover:text-green-600">Shop Now →</div>
            </div>
          </Link>

          <Link href="/shop" className="group">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300 border border-purple-200 dark:border-purple-800">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Premium</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Luxury items</p>
              <div className="mt-3 text-purple-500 font-semibold text-sm group-hover:text-purple-600">Shop Now →</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Deal Products */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            🔥 Hot Deals
          </h2>
          <div className="text-sm text-primary-600 dark:text-primary-400 font-semibold">
            Limited quantities available
          </div>
        </div>
        
        <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 h-80 rounded-lg mb-4"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
            </div>
          ))}
        </div>}>
          <ProductList categoryId="all" searchParams={searchParams} limit={12} />
        </Suspense>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-700 dark:to-secondary-700 rounded-2xl p-8 md:p-12 text-white text-center mb-12">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">Never Miss a Deal!</h3>
        <p className="text-lg mb-6 opacity-90">
          Subscribe to our newsletter and be the first to know about exclusive offers and flash sales.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealsPage;
