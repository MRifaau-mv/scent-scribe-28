import { createContext, useContext, useState, type ReactNode } from "react";
import type { Perfume } from "@/lib/products";

export interface CartLine {
  perfume: Perfume;
  qty: number;
}

interface CartContextValue {
  cart: CartLine[];
  cartCount: number;
  subtotal: number;
  addToCart: (perfume: Perfume, qty: number) => void;
  changeQty: (id: string, delta: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);

  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0);
  const subtotal = cart.reduce((sum, line) => sum + line.qty * line.perfume.price, 0);

  const addToCart = (perfume: Perfume, qty: number) => {
    setCart((prev) => {
      const existing = prev.find((line) => line.perfume.id === perfume.id);
      if (existing) {
        return prev.map((line) =>
          line.perfume.id === perfume.id
            ? { ...line, qty: line.qty + qty }
            : line,
        );
      }
      return [...prev, { perfume, qty }];
    });
  };

  const changeQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((line) =>
          line.perfume.id === id ? { ...line, qty: line.qty + delta } : line,
        )
        .filter((line) => line.qty > 0),
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, cartCount, subtotal, addToCart, changeQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
