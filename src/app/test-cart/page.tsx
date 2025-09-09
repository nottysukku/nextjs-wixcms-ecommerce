"use client";

import { useCartStore } from "@/hooks/useCartStore";
import { useWixClient } from "@/hooks/useWixClient";
import { useEffect } from "react";
import Image from "next/image";
import { media as wixMedia } from "@wix/sdk";
import Link from "next/link";

const CartPage = () => {
  const wixClient = useWixClient();
  const { cart, isLoading, removeItem, updateItemQuantity, calculateSubtotal, getCart } = useCartStore();

  useEffect(() => {
    if (wixClient) {
      getCart(wixClient);
    }
  }, [wixClient, getCart]);

  const handleCheckout = async () => {
    if (!wixClient) return;
    
    try {
      const checkoutData = await wixClient.currentCart.createCheckoutFromCurrentCart({
        channelType: "WEB" as any,
      });

      console.log("Checkout data:", checkoutData);
      
      // Handle different response formats
      if (checkoutData?.checkoutUrl) {
        // Direct checkout URL
        window.location.href = checkoutData.checkoutUrl;
      } else if (checkoutData?.checkoutId) {
        // Construct checkout URL using checkoutId
        const checkoutUrl = `https://www.wix.com/checkout/start?checkoutId=${checkoutData.checkoutId}`;
        console.log("Constructed checkout URL:", checkoutUrl);
        window.location.href = checkoutUrl;
      } else if (checkoutData?.redirects?.checkoutUrl) {
        window.location.href = checkoutData.redirects.checkoutUrl;
      } else {
        // Try to use Wix redirect session
        try {
          const redirectSession = await wixClient.redirects.createRedirectSession({
            ecomCheckout: {
              checkoutId: checkoutData.checkoutId
            }
          });
          
          if (redirectSession?.fullUrl) {
            window.location.href = redirectSession.fullUrl;
          } else {
            throw new Error("No redirect URL in session");
          }
        } catch (redirectError) {
          console.error("Redirect session error:", redirectError);
          alert("Unable to proceed to checkout. Please try again or contact support.");
        }
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cart.lineItems || cart.lineItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Add some items to your cart to get started</p>
          <Link href="/shop" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Shopping Cart</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {/* Cart Items */}
          <div className="p-6">
            {cart.lineItems.map((item, index) => (
              <div key={item._id} className={`flex gap-4 py-6 ${index !== cart.lineItems!.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                {item.image && (
                  <Image
                    src={wixMedia.getScaledToFillImageUrl(item.image, 120, 150, {})}
                    alt={item.productName?.original || "Product"}
                    width={120}
                    height={150}
                    className="object-cover rounded-md"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {item.productName?.original}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {item.availability?.status}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 dark:text-gray-400">Qty:</span>
                      <div className="flex items-center gap-2">
                        <button
                          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                          disabled={isLoading || (item.quantity || 1) <= 1}
                          onClick={() => updateItemQuantity(wixClient, item._id!, (item.quantity || 1) - 1)}
                        >
                          −
                        </button>
                        <span className="w-10 text-center font-medium">{item.quantity}</span>
                        <button
                          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          disabled={isLoading}
                          onClick={() => updateItemQuantity(wixClient, item._id!, (item.quantity || 1) + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        ₹{item.price?.amount}
                      </div>
                      <button
                        className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium mt-1"
                        disabled={isLoading}
                        onClick={() => removeItem(wixClient, item._id!)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Cart Summary */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-700/50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">Total</span>
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">₹{calculateSubtotal()}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Shipping and taxes will be calculated at checkout
            </p>
            <div className="flex gap-4">
              <Link href="/shop" className="flex-1">
                <button className="w-full py-3 px-6 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium">
                  Continue Shopping
                </button>
              </Link>
              <button
                onClick={handleCheckout}
                disabled={isLoading || !wixClient}
                className="flex-1 py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isLoading ? "Processing..." : "Proceed to Checkout"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;