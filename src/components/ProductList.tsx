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
          className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
          key={product._id}
        >
          <div className="relative w-full h-80">
            <Image
              src={product.media?.mainMedia?.image?.url || "/product.png"}
              alt=""
              fill
              sizes="25vw"
              className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
            />
            {product.media?.items && (
              <Image
                src={product.media?.items[1]?.image?.url || "/product.png"}
                alt=""
                fill
                sizes="25vw"
                className="absolute object-cover rounded-md"
              />
            )}
          </div>
          <div className="flex justify-between">
            <span className="font-medium">{product.name}</span>
            <span className="font-semibold">₹{product.price?.price}</span>
          </div>
          {product.additionalInfoSections && (
            <div
              className="text-sm text-gray-500"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  product.additionalInfoSections.find(
                    (section: any) => section.title === "shortDesc"
                  )?.description || ""
                ),
              }}
            ></div>
          )}
          <button className="rounded-2xl ring-1 ring-sukku text-sukku w-max py-2 px-4 text-xs hover:bg-sukku hover:text-white">
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
        <div className="w-full text-center py-12">
          <p className="text-gray-500">Error loading products. Please try again later.</p>
        </div>
      </div>
    );
  }
};

export default ProductList;
