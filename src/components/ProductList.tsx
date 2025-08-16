import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import Pagination from "./Pagination";

const PRODUCT_PER_PAGE = 8;

const ProductList = async ({
  categoryId,
  limit,
  searchParams,
}: {
  categoryId: string;
  limit?: number;
  searchParams?: any;
}) => {
  const wixClient = await wixClientServer();

  let productQuery = wixClient.products.queryProducts();

  // Add name filter if search term exists
  if (searchParams?.name) {
    productQuery = productQuery.startsWith("name", searchParams.name);
  }

  // Add category filter only if categoryId is valid
  if (categoryId && categoryId !== "all" && categoryId.trim() !== "") {
    productQuery = productQuery.eq("collectionIds", categoryId);
  }

  // Add product type filter
  productQuery = productQuery.hasSome(
    "productType",
    searchParams?.type ? [searchParams.type] : ["physical", "digital"]
  );

  // Add price range filters
  if (searchParams?.min && searchParams.min > 0) {
    productQuery = productQuery.gt("priceData.price", searchParams.min);
  }
  
  if (searchParams?.max && searchParams.max < 999999) {
    productQuery = productQuery.lt("priceData.price", searchParams.max);
  }

  // Add pagination
  productQuery = productQuery
    .limit(limit || PRODUCT_PER_PAGE)
    .skip(
      searchParams?.page
        ? parseInt(searchParams.page) * (limit || PRODUCT_PER_PAGE)
        : 0
    );
  // .find();

  // Add sorting if specified
  if (searchParams?.sort) {
    const [sortType, sortBy] = searchParams.sort.split(" ");

    if (sortType === "asc") {
      productQuery = productQuery.ascending(sortBy);
    }
    if (sortType === "desc") {
      productQuery = productQuery.descending(sortBy);
    }
  }

  console.log("Query parameters:", {
    categoryId,
    searchName: searchParams?.name,
    type: searchParams?.type,
    min: searchParams?.min,
    max: searchParams?.max,
    sort: searchParams?.sort
  });

  try {
    const res = await productQuery.find();
    
    return (
      <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
        {res.items.map((product: products.Product) => (
        <Link
          href={"/" + product.slug}
          className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%] group"
          key={product._id}
        >
          <div className="relative w-full h-80 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
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
          </div>
          <div className="flex justify-between items-start">
            <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {product.name}
            </span>
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
          <button className="rounded-lg ring-1 ring-primary-600 text-primary-600 dark:ring-primary-400 dark:text-primary-400 w-max py-2 px-4 text-xs hover:bg-primary-600 hover:text-white dark:hover:bg-primary-400 dark:hover:text-gray-900 transition-all duration-200 font-medium">
            Add to Cart
          </button>
        </Link>
      ))}
      {searchParams?.cat || searchParams?.name ? (
        <Pagination
          currentPage={res.currentPage || 0}
          hasPrev={res.hasPrev()}
          hasNext={res.hasNext()}
        />
      ) : null}
    </div>
  );
  } catch (error) {
    console.error("Error fetching products:", error);
    return (
      <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
        <div className="w-full text-center py-12 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400 font-medium">Error loading products. Please try again later.</p>
        </div>
      </div>
    );
  }
};

export default ProductList;
