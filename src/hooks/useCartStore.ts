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
  updateItemQuantity: (wixClient: WixClient, itemId: string, newQuantity: number) => void;
  calculateSubtotal: () => string;
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: {} as currentCart.Cart,
  isLoading: true,
  counter: 0,
  getCart: async (wixClient) => {
    if (!wixClient?.currentCart) {
      console.warn("WixClient or currentCart not available, skipping cart fetch");
      set((prev) => ({ 
        ...prev, 
        isLoading: false,
        cart: {
          lineItems: [],
        } as currentCart.Cart,
        counter: 0
      }));
      return;
    }

    try {
      const cart = await wixClient.currentCart.getCurrentCart();
      
      // Use the cart as is from Wix API - it has the proper structure
      const safeCart = cart || ({
        lineItems: [],
      } as currentCart.Cart);

      set({
        cart: safeCart,
        isLoading: false,
        counter: safeCart.lineItems?.length || 0,
      });
    } catch (err) {
      console.error("Error getting cart:", err);
      set((prev) => ({ 
        ...prev, 
        isLoading: false,
        cart: {
          lineItems: [],
        } as currentCart.Cart
      }));
    }
  },
  addItem: async (wixClient, productId, variantId, quantity, selectedOptions) => {
    console.log("🛒 addItem function called");
    console.log("📋 Parameter check:", {
      wixClientType: typeof wixClient,
      productIdType: typeof productId,
      productIdValue: productId,
      variantIdType: typeof variantId,
      variantIdValue: variantId,
      quantityType: typeof quantity,
      quantityValue: quantity,
      selectedOptionsType: typeof selectedOptions,
      selectedOptionsValue: selectedOptions
    });
    
    console.log("🔍 WixClient debug:", {
      wixClient,
      hasCurrentCart: !!wixClient?.currentCart,
      hasAddToCurrentCart: !!wixClient?.currentCart?.addToCurrentCart
    });

    // Validate parameters
    if (!wixClient) {
      console.error("❌ WixClient is undefined!");
      set((state) => ({ ...state, isLoading: false }));
      throw new Error("WixClient is not available");
    }

    if (!wixClient.currentCart) {
      console.error("❌ WixClient.currentCart is undefined!");
      set((state) => ({ ...state, isLoading: false }));
      throw new Error("WixClient.currentCart is not available");
    }

    if (typeof productId !== 'string' || !productId) {
      console.error("❌ Invalid productId:", productId);
      set((state) => ({ ...state, isLoading: false }));
      throw new Error("Invalid productId");
    }

    if (typeof quantity !== 'number' || quantity <= 0) {
      console.error("❌ Invalid quantity:", quantity);
      set((state) => ({ ...state, isLoading: false }));
      throw new Error("Invalid quantity");
    }
    
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
  updateItemQuantity: async (wixClient, itemId, newQuantity) => {
    if (newQuantity <= 0) {
      // If quantity is 0 or negative, remove the item instead
      return get().removeItem(wixClient, itemId);
    }

    set((state) => ({ ...state, isLoading: true }));
    try {
      const response = await wixClient.currentCart.updateCurrentCartLineItemQuantity([{
        _id: itemId,
        quantity: newQuantity
      }]);

      set({
        cart: response.cart,
        counter: response.cart?.lineItems?.length || 0,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error updating item quantity:", error);
      set((state) => ({ ...state, isLoading: false }));
      throw error;
    }
  },
  calculateSubtotal: (): string => {
    // Use get() to access current state without TypeScript issues
    const { cart } = get();
    
    if (!cart?.lineItems || cart.lineItems.length === 0) {
      return "0.00";
    }

    try {
      const total = cart.lineItems.reduce((total: number, item: any) => {
        // Handle both string and number values for price amount
        const itemPrice = typeof item.price?.amount === 'string' 
          ? parseFloat(item.price.amount) || 0 
          : Number(item.price?.amount) || 0;
        const itemQuantity = Number(item.quantity) || 1;
        return total + (itemPrice * itemQuantity);
      }, 0);
      
      // Ensure we return a properly formatted string
      return isNaN(total) ? "0.00" : total.toFixed(2);
    } catch (error) {
      console.error("Error calculating subtotal:", error);
      return "0.00";
    }
  },
}));
