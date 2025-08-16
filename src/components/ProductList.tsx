import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";
import Link from "next/link";
import Pagination from "./Pagination";
import ProductCard from "./ProductCard";

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
          <ProductCard key={product._id} product={product} />
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
