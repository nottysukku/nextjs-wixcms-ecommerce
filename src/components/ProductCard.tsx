"use client";

import { products } from "@wix/stores";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { useCartStore } from "@/hooks/useCartStore";
import { useWixClient } from "@/hooks/useWixClient";
import { useRouter } from "next/navigation";

const ProductCard = ({ product }: { product: products.Product }) => {
  const wixClient = useWixClient();
  const { addItem, isLoading } = useCartStore();
  const router = useRouter();

  // Check if product has variants that require user selection
  const hasSelectableVariants = product.productOptions && product.productOptions.length > 0;
  
  // For products with selectable variants, we should not allow direct add to cart
  // For products without selectable variants, we can use the first available variant
  const getVariantInfo = () => {
    if (!hasSelectableVariants) {
      // Product has no selectable variants - use first available variant or default
      const firstVariant = product.variants && product.variants.length > 0 
        ? product.variants[0] 
        : null;
      
      if (firstVariant) {
        return {
          variantId: firstVariant._id || "00000000-0000-0000-0000-000000000000",
          stockNumber: firstVariant.stock?.quantity ?? 
            (firstVariant.stock?.inStock !== false ? 999 : 0),
          canAddToCart: firstVariant.stock?.inStock !== false
        };
      }
      
      // Fallback to product-level stock
      return {
        variantId: "00000000-0000-0000-0000-000000000000",
        stockNumber: product.stock?.quantity ?? (product.stock?.inStock ? 999 : 0),
        canAddToCart: product.stock?.inStock !== false
      };
    }

    // Product has selectable variants - user must choose options first
    return {
      variantId: "00000000-0000-0000-0000-000000000000",
      stockNumber: 0,
      canAddToCart: false
    };
  };

  const variantInfo = getVariantInfo();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    
    if (!variantInfo.canAddToCart) return;
    
    addItem(
      wixClient, 
      product._id!, 
      variantInfo.variantId, 
      1
    );
  };

  const handleSelectOptions = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/" + product.slug);
  };

  return (
    <div
      className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%] group"
      key={product._id}
    >
      <Link href={"/" + product.slug} className="relative w-full h-80 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
        <Image
          src={product.media?.mainMedia?.image?.url || "/product.png"}
          alt={product.name || "Product image"}
          fill
          sizes="25vw"
          className="absolute object-cover z-10 hover:opacity-0 transition-opacity easy duration-500 group-hover:scale-105"
        />
        {product.media?.items && (
          <Image
            src={product.media?.items[1]?.image?.url || "/product.png"}
            alt={product.name || "Product image"}
            fill
            sizes="25vw"
            className="absolute object-cover"
          />
        )}
      </Link>
      <div className="flex justify-between items-start">
        <Link href={"/" + product.slug}>
          <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {product.name}
          </span>
        </Link>
        <span className="font-semibold text-primary-600 dark:text-primary-400">
          ₹{product.price?.price}
        </span>
      </div>
      {product.additionalInfoSections && (
        <div
          className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              product.additionalInfoSections.find(
                (section: any) => section.title === "shortDesc"
              )?.description || ""
            ),
          }}
        ></div>
      )}
      {/* Smart Add to Cart Button */}
      <div className="mt-auto">
        {hasSelectableVariants && !variantInfo.canAddToCart ? (
          <button 
            onClick={handleSelectOptions}
            className="w-full rounded-lg ring-1 ring-primary-600 text-primary-600 dark:ring-primary-400 dark:text-primary-400 py-2 px-4 text-xs hover:bg-primary-600 hover:text-white dark:hover:bg-primary-400 dark:hover:text-gray-900 transition-all duration-200 font-medium"
          >
            Select Options
          </button>
        ) : (
          <button 
            onClick={handleAddToCart}
            disabled={isLoading || variantInfo.stockNumber < 1}
            className="w-full rounded-lg ring-1 ring-primary-600 text-primary-600 dark:ring-primary-400 dark:text-primary-400 py-2 px-4 text-xs hover:bg-primary-600 hover:text-white dark:hover:bg-primary-400 dark:hover:text-gray-900 transition-all duration-200 font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Adding..." : 
             variantInfo.stockNumber < 1 ? "Out of Stock" : 
             hasSelectableVariants ? "Select Options" : "Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
