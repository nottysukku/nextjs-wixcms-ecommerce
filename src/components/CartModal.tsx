"use client";

import Image from "next/image";
import { useCartStore } from "@/hooks/useCartStore";
import { media as wixMedia } from "@wix/sdk";
import { useWixClient } from "@/hooks/useWixClient";
import { currentCart } from "@wix/ecom";

const CartModal = () => {
  // TEMPORARY
  // const cartItems = true;

  const wixClient = useWixClient();
  const { cart, isLoading, removeItem } = useCartStore();

  const handleCheckout = async () => {
    try {
      const checkout =
        await wixClient.currentCart.createCheckoutFromCurrentCart({
          channelType: currentCart.ChannelType.WEB,
        });

      const { redirectSession } =
        await wixClient.redirects.createRedirectSession({
          ecomCheckout: { checkoutId: checkout.checkoutId },
          callbacks: {
            postFlowUrl: window.location.origin,
            thankYouPageUrl: `${window.location.origin}/success`,
          },
        });

      if (redirectSession?.fullUrl) {
        window.location.href = redirectSession.fullUrl;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const calculateSubtotal = () => {
    return cart.lineItems?.reduce((total, item) => {
      const itemPrice = Number(item.price?.amount) || 0;
      const itemQuantity = Number(item.quantity) || 1;
      return total + (itemPrice * itemQuantity);
    }, 0) || 0;
  };

  return (
    <div className="w-max absolute p-6 rounded-lg shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 top-12 right-0 flex flex-col gap-6 z-20 min-w-80">
      {!cart.lineItems ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="mb-2 text-4xl">🛒</div>
          <p>Your cart is empty</p>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
            Shopping Cart
          </h2>
          {/* LIST */}
          <div className="flex flex-col gap-4 max-h-96 overflow-y-auto">
            {/* ITEM */}
            {cart.lineItems.map((item) => (
              <div className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg" key={item._id}>
                {item.image && (
                  <Image
                    src={wixMedia.getScaledToFillImageUrl(
                      item.image,
                      72,
                      96,
                      {}
                    )}
                    alt={item.productName?.original || "Product"}
                    width={72}
                    height={96}
                    className="object-cover rounded-md"
                  />
                )}
                <div className="flex flex-col justify-between w-full">
                  {/* TOP */}
                  <div className="">
                    {/* TITLE */}
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                        {item.productName?.original}
                      </h3>
                      <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-md flex items-center gap-2 text-sm">
                        {item.quantity && item.quantity > 1 && (
                          <div className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                            {item.quantity} x{" "}
                          </div>
                        )}
                        <span className="font-semibold text-primary-700 dark:text-primary-300">
                          ₹{item.price?.amount}
                        </span>
                      </div>
                    </div>
                    {/* DESC */}
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.availability?.status}
                    </div>
                  </div>
                  {/* BOTTOM */}
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600 dark:text-gray-400">Qty. {item.quantity}</span>
                    <button
                      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                      onClick={() => removeItem(wixClient, item._id!)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* BOTTOM */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between font-semibold text-lg mb-2">
              <span className="text-gray-900 dark:text-gray-100">Subtotal</span>
              <span className="text-primary-600 dark:text-primary-400">₹{calculateSubtotal()}</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="flex gap-3">
              <button className="flex-1 rounded-lg py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
                View Cart
              </button>
              <button
                className="flex-1 rounded-lg py-3 px-4 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400 text-white disabled:cursor-not-allowed disabled:opacity-50 transition-colors font-medium"
                disabled={isLoading}
                onClick={handleCheckout}
              >
                {isLoading ? "Processing..." : "Checkout"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartModal;
