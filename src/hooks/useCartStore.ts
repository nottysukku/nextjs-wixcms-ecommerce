import { create } from "zustand";
import { currentCart } from "@wix/ecom";
import { WixClient } from "@/context/wixContext";

type CartState = {
  cart: currentCart.Cart;
  isLoading: boolean;
  counter: number;
  getCart: (wixClient: WixClient) => void;
  addItem: (
    wixClient: WixClient,
    productId: string,
    variantId: string,
    quantity: number,
    selectedOptions?: { [key: string]: string }
  ) => void;
  removeItem: (wixClient: WixClient, itemId: string) => void;
};

export const useCartStore = create<CartState>((set) => ({
  cart: {} as currentCart.Cart,
  isLoading: true,
  counter: 0,
  getCart: async (wixClient) => {
    try {
      const cart = await wixClient.currentCart.getCurrentCart();
      set({
        cart: cart || ({} as currentCart.Cart),
        isLoading: false,
        counter: cart?.lineItems?.length || 0,
      });
    } catch (err) {
      set((prev) => ({ ...prev, isLoading: false }));
    }
  },
  addItem: async (wixClient, productId, variantId, quantity, selectedOptions) => {
    console.log("🛒 addItem function called with:", {
      productId,
      variantId,
      quantity,
      selectedOptions
    });
    
    set((state) => ({ ...state, isLoading: true }));
    try {
      // Construct catalog reference based on whether we have a real variant ID
      const catalogReference: any = {
        appId: process.env.NEXT_PUBLIC_WIX_APP_ID || "1380b703-ce81-ff05-f115-39571d94dfcd",
        catalogItemId: productId,
      };

      console.log("🏗️ Initial catalog reference:", catalogReference);

      // Only add variantId if it's not the default placeholder
      if (variantId && variantId !== "00000000-0000-0000-0000-000000000000") {
        catalogReference.options = { variantId };
        console.log("✅ Using real variantId:", variantId);
      } else if (selectedOptions && Object.keys(selectedOptions).length > 0) {
        // For products with options but no real variants, use the selectedOptions directly
        // Try different formats to see which one works with Wix API
        catalogReference.options = selectedOptions;
        console.log("✅ Using selectedOptions directly as options:", selectedOptions);
      } else {
        console.log("⚠️ No real variantId and no selectedOptions - adding product without options");
      }

      console.log("📦 Final catalog reference for Wix API:", catalogReference);

      const lineItem = {
        catalogReference,
        quantity: quantity,
      };
      
      console.log("🎯 Line item to add:", lineItem);

      const response = await wixClient.currentCart.addToCurrentCart({
        lineItems: [lineItem],
      });

      console.log("✨ Cart add response:", response);
      console.log("🧾 Cart after adding:", response.cart);
      console.log("📊 Line items count:", response.cart?.lineItems?.length);

      const newCounter = response.cart?.lineItems?.length || 0;
      console.log("🔢 Setting counter to:", newCounter);

      set({
        cart: response.cart,
        counter: newCounter,
        isLoading: false,
      });
      
      console.log("✅ Cart store updated successfully");
    } catch (error) {
      console.error("❌ Error adding item to cart:", error);
      console.error("❌ Error details:", JSON.stringify(error, null, 2));
      set((state) => ({ ...state, isLoading: false }));
      throw error;
    }
  },
  removeItem: async (wixClient, itemId) => {
    set((state) => ({ ...state, isLoading: true }));
    try {
      const response = await wixClient.currentCart.removeLineItemsFromCurrentCart(
        [itemId]
      );

      set({
        cart: response.cart,
        counter: response.cart?.lineItems?.length || 0,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      set((state) => ({ ...state, isLoading: false }));
      throw error;
    }
  },
}));
