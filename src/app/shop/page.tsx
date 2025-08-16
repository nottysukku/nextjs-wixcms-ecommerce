import Filter from "@/components/Filter";
import ProductList from "@/components/ProductList";
import { wixClientServer } from "@/lib/wixClientServer";
import Image from "next/image";
import { Suspense } from "react";

const ShopPage = async ({ searchParams }: { searchParams: any }) => {
  const wixClient = await wixClientServer();

  // Get categories for the shop page
  const categories = await wixClient.collections.queryCollections().find();

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative min-h-screen bg-white dark:bg-secondary-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950 rounded-2xl p-8 md:p-12 mb-12 mt-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Shop Collection
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Discover our curated selection of premium products. From everyday essentials to luxury items, 
            find everything you need in one place.
          </p>
          <div className="flex justify-center">
            <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full px-6 py-3">
              <span className="text-primary-700 dark:text-primary-300 font-semibold">
                🎯 Free Shipping on Orders Over ₹999
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      {categories.items && categories.items.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.items.slice(0, 8).map((category) => (
              <div
                key={category._id}
                className="group cursor-pointer bg-white dark:bg-secondary-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="aspect-square relative bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30">
                  {category.media?.mainMedia?.image?.url ? (
                    <Image
                      src={category.media.mainMedia.image.url}
                      alt={category.name || "Category"}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-4xl">📦</div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-center group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Products Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            All Products
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing premium quality items
          </div>
        </div>
        
        <Suspense fallback={<div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>}>
          <Filter />
        </Suspense>

        <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 h-80 rounded-lg mb-4"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
            </div>
          ))}
        </div>}>
          <ProductList categoryId="all" searchParams={searchParams} />
        </Suspense>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-r from-secondary-50 to-primary-50 dark:from-secondary-950 dark:to-primary-950 rounded-2xl p-8 md:p-12 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚚</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Fast Delivery</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Free shipping on orders over ₹999</p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💯</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Quality Guarantee</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">30-day money-back guarantee</p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Secure Payment</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">100% secure payment processing</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
