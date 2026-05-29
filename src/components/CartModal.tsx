"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/hooks/useCartStore";
import { media as wixMedia } from "@wix/sdk";
import { useWixClient } from "@/hooks/useWixClient";
import { currentCart } from "@wix/ecom";
import { loadRazorpayScript } from "@/lib/loadRazorpay";

const CartModal = () => {
  // TEMPORARY
  // const cartItems = true;

  const wixClient = useWixClient();
  const { cart, isLoading, removeItem, updateItemQuantity, calculateSubtotal } = useCartStore();
  const [isRazorpayLoading, setIsRazorpayLoading] = useState(false);
  const [isCODLoading, setIsCODLoading] = useState(false);

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
          receipt: `rcpt_modal_${Date.now()}`
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
        description: "Secure Checkout Payment",
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

      // Calculate dynamic delivery ETA: 5 business days for COD
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
        console.log("📧 COD Sandbox Email Preview:", result.previewUrl);
        alert(`🎉 Cash on Delivery Order Placed! \n\nOrder ID: ${result.orderId}\nConfirmation email sent to: ${customerEmail}\n\nClick OK to preview the email.`);
        window.open(result.previewUrl, "_blank");
      } else {
        alert(`🎉 Cash on Delivery Order Placed! \n\nOrder ID: ${result.orderId}\nConfirmation email sent to: ${customerEmail}`);
      }

      window.location.href = `/success?orderId=${result.orderId}`;
    } catch (err: any) {
      console.error("COD order error:", err);
      alert(`Order failed: ${err.message || "Something went wrong"}`);
    } finally {
      setIsCODLoading(false);
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
            {cart.lineItems.map((item: any) => (
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
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Link href="/test-cart" className="flex-1">
                  <button className="w-full rounded-lg py-2 px-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm">
                    View Cart
                  </button>
                </Link>
                <button
                  className="flex-1 rounded-lg py-2 px-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400 text-white disabled:cursor-not-allowed disabled:opacity-50 transition-colors font-medium text-sm"
                  disabled={isLoading || !wixClient}
                  onClick={handleCheckout}
                >
                  {isLoading ? "Processing..." : "Wix Checkout"}
                </button>
              </div>
              <button
                className="w-full rounded-lg py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || isRazorpayLoading || !cart.lineItems || cart.lineItems.length === 0}
                onClick={handleRazorpayCheckout}
              >
                {isRazorpayLoading ? "Loading..." : "💳 Pay Securely with Razorpay"}
              </button>
              <button
                className="w-full rounded-lg py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || isCODLoading || !cart.lineItems || cart.lineItems.length === 0}
                onClick={handleCODOrder}
              >
                {isCODLoading ? "Placing Order..." : "📦 Cash on Delivery"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartModal;

