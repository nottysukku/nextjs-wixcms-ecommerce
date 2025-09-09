import Filter from "@/components/Filter";
import ProductList from "@/components/ProductList";
import Skeleton from "@/components/Skeleton";
import { wixClientServer } from "@/lib/wixClientServer";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

const ListPage = async ({ searchParams }: { searchParams: any }) => {
  const wixClient = await wixClientServer();

  let cat;
  try {
    cat = await wixClient.collections.getCollectionBySlug(
      searchParams.cat || "all-products"
    );
  } catch (error) {
    console.error("Error fetching category:", error);
    // Fallback to all products if category not found
    cat = { collection: { name: "All Products", _id: "00000000-000000-000000-000000000001" } };
  }

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative min-h-screen bg-white dark:bg-secondary-900 transition-colors duration-300">
      {/* Breadcrumbs */}
      <div className="py-4 mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Home
          </Link>
          <span>›</span>
          <Link href="/shop" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Shop
          </Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-gray-100 font-medium">
            {cat?.collection?.name || "Category"}
          </span>
        </nav>
      </div>

      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {cat?.collection?.name || "All Products"}
        </h1>
        {cat?.collection?.description && (
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            {cat.collection.description}
          </p>
        )}
      </div>

      {/* CAMPAIGN */}
      <div className="hidden bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950 px-4 sm:flex justify-between rounded-2xl overflow-hidden mb-8">
        <div className="w-2/3 flex flex-col items-start justify-center gap-6 p-8">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900 dark:text-gray-100">
            Grab up to 50% off on
            <br /> Selected Products
          </h2>
          <button className="rounded-full bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 text-sm font-semibold transition-colors duration-200 shadow-md hover:shadow-lg">
            Shop Sale Items
          </button>
        </div>
        <div className="relative w-1/3">
          <Image src="/woman.png" alt="Shopping" fill className="object-contain" />
        </div>
      </div>
      
      {/* FILTER */}
      <div className="mb-8">
        <Filter />
      </div>
      
      {/* PRODUCTS */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {cat?.collection?.name ? `${cat.collection.name} Collection` : "All Products"}
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing results for "{cat?.collection?.name || "All Products"}"
          </div>
        </div>
        
        <Suspense fallback={<Skeleton/>}>
          <ProductList
            categoryId={
              cat?.collection?._id || "00000000-000000-000000-000000000001"
            }
            searchParams={searchParams}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default ListPage;
