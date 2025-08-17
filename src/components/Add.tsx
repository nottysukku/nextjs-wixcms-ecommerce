"use client";

import { useCartStore } from "@/hooks/useCartStore";
import { useWixClient } from "@/hooks/useWixClient";
import { useState } from "react";

const Add = ({
  productId,
  variantId,
  stockNumber,
  selectedOptions,
}: {
  productId: string;
  variantId: string;
  stockNumber: number;
  selectedOptions?: { [key: string]: string };
}) => {
  const [quantity, setQuantity] = useState(1);

  // // TEMPORARY
  // const stock = 4;

  const handleQuantity = (type: "i" | "d") => {
    if (type === "d" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
    if (type === "i" && (stockNumber >= 999 ? quantity < 99 : quantity < stockNumber)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const wixClient = useWixClient();

  const { addItem, isLoading } = useCartStore();

  // Debug: Log the props being passed to Add component
  console.log("Add component props:", { productId, variantId, stockNumber, selectedOptions });

  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-medium">Choose a Quantity</h4>
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-32">
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20 text-black"
              onClick={() => handleQuantity("d")}
              disabled={quantity===1}
            >
              -
            </button>
            <span className="text-black">{quantity}</span>
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20 text-black"
              onClick={() => handleQuantity("i")}
              disabled={stockNumber >= 999 ? quantity >= 99 : quantity >= stockNumber}
            >
              +
            </button>
          </div>
          {stockNumber < 1 ? (
            <div className="text-xs">Product is out of stock</div>
          ) : stockNumber >= 999 ? (
            <div className="text-xs">
              <span className="text-green-500">In Stock</span>{" "}
              <br /> Available for purchase
            </div>
          ) : (
            <div className="text-xs">
              Only <span className="text-orange-500">{stockNumber} items</span>{" "}
              left!
              <br /> {"Don't"} miss it
            </div>
          )}
        </div>
        <button
          onClick={async () => {
            console.log("🔵 Add to Cart button clicked!");
            console.log("🔵 Button parameters:", { productId, variantId, quantity, selectedOptions });
            
            try {
              console.log("🔵 Calling addItem...");
              await addItem(wixClient, productId, variantId, quantity, selectedOptions);
              console.log("✅ addItem completed successfully");
            } catch (error) {
              console.error("❌ addItem failed:", error);
            }
          }}
          disabled={isLoading}
          className="w-36 text-sm rounded-3xl ring-1 ring-sukku text-black bg-white hover:bg-sukku hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white transition-colors duration-200"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Add;
