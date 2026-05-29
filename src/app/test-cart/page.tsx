"use client";

import { useCartStore } from "@/hooks/useCartStore";
import { useWixClient } from "@/hooks/useWixClient";
import { useEffect, useState } from "react";
import Image from "next/image";
import { media as wixMedia } from "@wix/sdk";
import Link from "next/link";
import { loadRazorpayScript } from "@/lib/loadRazorpay";

const CartPage = () => {
  const wixClient = useWixClient();
  const { cart, isLoading, removeItem, updateItemQuantity, calculateSubtotal, getCart } = useCartStore();
  const [isRazorpayLoading, setIsRazorpayLoading] = useState(false);
  const [isCODLoading, setIsCODLoading] = useState(false);

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

      const checkoutId = checkoutData?.checkoutId || (checkoutData as any)?._id;
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
    } catch (err: any) {
      console.error("Checkout error:", err);
      alert(`Checkout failed: ${err?.message || "Please try again"}`);
    }
  };

  const handleRazorpayCheckout = async () => {
    setIsRazorpayLoading(true);
    try {
      // 1. Enforce login with actual email
      if (!wixClient || !wixClient.auth.loggedIn()) {
        alert("Please log in with your actual email first to proceed with checkout and receive email updates.");
        window.location.href = "/login";
        setIsRazorpayLoading(false);
        return;
      }

      // 2. Fetch customer member details
      const memberRes = await wixClient.members.getCurrentMember({
        fieldsets: ["FULL" as any],
      });
      const customerEmail = memberRes.member?.loginEmail || memberRes.member?.contact?.emails?.[0];
      const firstName = memberRes.member?.contact?.firstName || memberRes.member?.profile?.nickname || "Valued";
      const lastName = memberRes.member?.contact?.lastName || "Customer";
      const fullName = `${firstName} ${lastName}`.trim();

      if (!customerEmail) {
        alert("Could not retrieve your actual email address. Please update your profile or log in again.");
        setIsRazorpayLoading(false);
        return;
      }

      const subtotalStr = calculateSubtotal();
      const amountInINR = parseFloat(subtotalStr);
      const amountInPaise = Math.round(amountInINR * 100);

      if (isNaN(amountInPaise) || amountInPaise < 100) {
        alert("Minimum checkout amount is ₹1.00 (100 paise)");
        setIsRazorpayLoading(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load Razorpay Checkout SDK. Please check your internet connection.");
        setIsRazorpayLoading(false);
        return;
      }

      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: `rcpt_cart_${Date.now()}`
        }),
      });

      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Nottysukkus",
        description: "Secure E-Commerce Payment",
        image: "/favicon.ico",
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            // Calculate dynamic delivery ETA: 3 business days from now
            const deliveryDays = 3;
            const etaDate = new Date();
            etaDate.setDate(etaDate.getDate() + deliveryDays);
            const etaString = etaDate.toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            const verifyResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                email: customerEmail,
                name: fullName,
                cartItems: cart.lineItems || [],
                total: subtotalStr,
                eta: etaString
              }),
            });

            const verifyResult = await verifyResponse.json();

            if (verifyResponse.ok && verifyResult.verified) {
              if (verifyResult.previewUrl) {
                console.log("📧 Sandbox Test Email Preview URL:", verifyResult.previewUrl);
                alert(`🎉 Payment Successful! \n\nAn order confirmation email has been sent to: ${customerEmail}. \n\nYou can preview this sandbox email in your browser by clicking OK.`);
                window.open(verifyResult.previewUrl, "_blank");
              } else {
                alert(`🎉 Payment Successful! Order confirmation email has been sent to: ${customerEmail}`);
              }
              window.location.href = `/success?orderId=${response.razorpay_order_id}`;
            } else {
              alert(`Payment verification failed: ${verifyResult.message || "Invalid signature"}`);
            }
          } catch (err: any) {
            console.error("Verification error:", err);
            alert("An error occurred while verifying your payment.");
          }
        },
        prefill: {
          name: fullName,
          email: customerEmail,
          contact: memberRes.member?.contact?.phones?.[0] || "9999999999",
        },
        theme: {
          color: "#4f46e5",
        },
        modal: {
          ondismiss: function () {
            console.log("Razorpay Checkout Modal dismissed");
            alert("Payment was cancelled or closed.");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on("payment.failed", function (response: any) {
        alert(`Payment failed: ${response.error.description || "Something went wrong"}`);
        console.error("Payment failure details:", response.error);
      });

      rzp.open();
    } catch (err: any) {
      console.error("Razorpay integration error:", err);
      alert(`Checkout failed: ${err.message || "Something went wrong"}`);
    } finally {
      setIsRazorpayLoading(false);
    }
  };

  const handleCODOrder = async () => {
    setIsCODLoading(true);
    try {
      // 1. Enforce login
      if (!wixClient || !wixClient.auth.loggedIn()) {
        alert("Please log in with your actual email first to place a Cash on Delivery order.");
        window.location.href = "/login";
        setIsCODLoading(false);
        return;
      }

      // 2. Fetch customer member details
      const memberRes = await wixClient.members.getCurrentMember({
        fieldsets: ["FULL" as any],
      });
      const customerEmail = memberRes.member?.loginEmail || memberRes.member?.contact?.emails?.[0];
      const firstName = memberRes.member?.contact?.firstName || memberRes.member?.profile?.nickname || "Valued";
      const lastName = memberRes.member?.contact?.lastName || "Customer";
      const fullName = `${firstName} ${lastName}`.trim();

      if (!customerEmail) {
        alert("Could not retrieve your email address. Please update your profile or log in again.");
        setIsCODLoading(false);
        return;
      }

      const subtotalStr = calculateSubtotal();

      // Calculate dynamic delivery ETA
      const deliveryDays = 5;
      const etaDate = new Date();
      etaDate.setDate(etaDate.getDate() + deliveryDays);
      const etaString = etaDate.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const response = await fetch("/api/cod-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: customerEmail,
          name: fullName,
          cartItems: cart.lineItems || [],
          total: subtotalStr,
          eta: etaString,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to place COD order");
      }

      if (result.previewUrl) {
        console.log("\ud83d\udce7 COD Sandbox Email Preview:", result.previewUrl);
        alert(`\ud83c\udf89 Cash on Delivery Order Placed! \n\nOrder ID: ${result.orderId}\nConfirmation email sent to: ${customerEmail}\n\nClick OK to preview the email.`);
        window.open(result.previewUrl, "_blank");
      } else {
        alert(`\ud83c\udf89 Cash on Delivery Order Placed! \n\nOrder ID: ${result.orderId}\nConfirmation email sent to: ${customerEmail}`);
      }

      window.location.href = `/success?orderId=${result.orderId}`;
    } catch (err: any) {
      console.error("COD order error:", err);
      alert(`Order failed: ${err.message || "Something went wrong"}`);
    } finally {
      setIsCODLoading(false);
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
            {cart.lineItems.map((item: any, index: number) => (
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
            <div className="flex flex-col sm:flex-row gap-3">
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
                {isLoading ? "Processing..." : "Wix Checkout"}
              </button>
              <button
                onClick={handleRazorpayCheckout}
                disabled={isLoading || isRazorpayLoading}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold"
              >
                {isRazorpayLoading ? "Loading..." : "💳 Pay with Razorpay"}
              </button>
              <button
                onClick={handleCODOrder}
                disabled={isLoading || isCODLoading}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold"
              >
                {isCODLoading ? "Placing Order..." : "📦 Cash on Delivery"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;