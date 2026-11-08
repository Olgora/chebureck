"use client";

import { createContext, useContext, useEffect, useState } from "react";
 

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (p: {
    id: string;
    name: string;
    price: number;
    quantity?: number;
    image: string;
  }) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  removeItem: (id: string) => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;

  cartPulse: boolean;
  triggerPulse: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // ✅ единственный источник инициализации
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartPulse, setCartPulse] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  function triggerPulse() {
    setCartPulse(true);

    setTimeout(() => {
      setCartPulse(false);
    }, 250);
  }

  function openCart() {
    setIsOpen(true);
  }

  function closeCart() {
    setIsOpen(false);
  }

  function increaseQty(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }

  function clearCart() {
    setItems([]);
  }

  function decreaseQty(id: string) {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  useEffect(() => {
    const saved = localStorage.getItem("cart");

    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        setItems([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  function addToCart(product: {
    id: string;
    name: string;
    price: number;
    quantity?: number;
    image: string;
  }) {
    const qty = product.quantity ?? 1;

    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);

      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + qty } : i,
        );
      }

      return [...prev, { ...product, quantity: qty }];
    });

    setCartPulse(true);
    triggerPulse();
  }

  // 💾 save (только это оставляем в effect)
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        isOpen,
        openCart,
        closeCart,
        clearCart,
        cartPulse,
        triggerPulse,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside provider");
  return ctx;
}
