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
    quantity: number
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
  addItem: async (wixClient, productId, variantId, quantity) => {
    set((state) => ({ ...state, isLoading: true }));
    try {
      // Construct catalog reference based on whether we have a real variant ID
      const catalogReference: any = {
        appId: process.env.NEXT_PUBLIC_WIX_APP_ID || "1380b703-ce81-ff05-f115-39571d94dfcd",
        catalogItemId: productId,
      };

      // Only add variantId if it's not the default placeholder
      if (variantId && variantId !== "00000000-0000-0000-0000-000000000000") {
        catalogReference.options = { variantId };
      }

      console.log("Adding item to cart:", {
        productId,
        variantId,
        quantity,
        catalogReference
      });

      const response = await wixClient.currentCart.addToCurrentCart({
        lineItems: [
          {
            catalogReference,
            quantity: quantity,
          },
        ],
      });

      console.log("Cart add response:", response);

      set({
        cart: response.cart,
        counter: response.cart?.lineItems?.length || 0,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
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
