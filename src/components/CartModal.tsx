"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/hooks/useCartStore";
import { media as wixMedia } from "@wix/sdk";
import { useWixClient } from "@/hooks/useWixClient";
import { currentCart } from "@wix/ecom";

const CartModal = () => {
  // TEMPORARY
  // const cartItems = true;

  const wixClient = useWixClient();
  const { cart, isLoading, removeItem, updateItemQuantity, calculateSubtotal } = useCartStore();

  const handleCheckout = async () => {
    if (!wixClient) {
      console.error("WixClient not available for checkout");
      return;
    }

    try {
      const checkoutData = await wixClient.currentCart.createCheckoutFromCurrentCart({
        channelType: currentCart.ChannelType.WEB,
      });

      console.log("Checkout data:", checkoutData);

      const checkoutId = checkoutData?._id;
      if (!checkoutId) {
        throw new Error("No checkout ID returned from Wix currentCart");
      }

      // Try to use Wix redirect session
      try {
        const redirectSession = await wixClient.redirects.createRedirectSession({
          ecomCheckout: {
            checkoutId: checkoutId
          },
          callbacks: {
            postFlowUrl: window.location.origin
          }
        });
        
        console.log("Redirect session response:", redirectSession);

        if (redirectSession?.redirectSession?.fullUrl) {
          window.location.href = redirectSession.redirectSession.fullUrl;
        } else if ((redirectSession as any)?.fullUrl) {
          window.location.href = (redirectSession as any).fullUrl;
        } else {
          throw new Error("No redirect URL in session");
        }
      } catch (redirectError) {
        console.error("Redirect session error:", redirectError);
        // Fallback: Construct standard checkout URL if redirects service fails
        const fallbackUrl = `https://www.wix.com/checkout/start?checkoutId=${checkoutId}`;
        console.log("Attempting fallback checkout URL:", fallbackUrl);
        window.location.href = fallbackUrl;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed. Please try again.");
    }
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
                  <div className="flex justify-between items-center text-sm mt-2">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 dark:text-gray-400">Qty:</span>
                      <div className="flex items-center gap-2">
                        <button
                          className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isLoading || (item.quantity || 1) <= 1}
                          onClick={() => updateItemQuantity(wixClient, item._id!, (item.quantity || 1) - 1)}
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isLoading}
                          onClick={() => updateItemQuantity(wixClient, item._id!, (item.quantity || 1) + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
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
              <Link href="/test-cart" className="flex-1">
                <button className="w-full rounded-lg py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
                  View Cart
                </button>
              </Link>
              <button
                className="flex-1 rounded-lg py-3 px-4 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400 text-white disabled:cursor-not-allowed disabled:opacity-50 transition-colors font-medium"
                disabled={isLoading || !wixClient}
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
