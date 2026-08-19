import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
    variantId: string;
    productId?: string;
    productName: string;
    productSlug?: string;
    weight: string;
    price: number;
    quantity: number;
    image: string;
}

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (variantId: string) => void;
    updateQuantity: (variantId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) =>
                set((state) => {
                    const existing = state.items.find(
                        (i) => i.variantId === item.variantId,
                    );
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.variantId === item.variantId
                                    ? {
                                          ...i,
                                          quantity: i.quantity + item.quantity,
                                      }
                                    : i,
                            ),
                        };
                    }
                    return { items: [...state.items, item] };
                }),
            removeItem: (variantId) =>
                set((state) => ({
                    items: state.items.filter((i) => i.variantId !== variantId),
                })),
            updateQuantity: (variantId, quantity) =>
                set((state) => {
                    if (quantity <= 0) {
                        return {
                            items: state.items.filter(
                                (i) => i.variantId !== variantId,
                            ),
                        };
                    }
                    return {
                        items: state.items.map((i) =>
                            i.variantId === variantId ? { ...i, quantity } : i,
                        ),
                    };
                }),
            clearCart: () => set({ items: [] }),
            totalItems: () =>
                get().items.reduce((sum, i) => sum + i.quantity, 0),
            totalPrice: () =>
                get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        }),
        {
            name: "spiceey-cart",
            partialize: (state) => ({ items: state.items }),
        },
    ),
);
