"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Тип выбранного доп. ингредиента
export type CartIngredient = {
  id: string;
  name: string;
  price: number;
};

// Тип позиции в корзине
export type CartItem = {
  cartItemId: string; // Уникальный идентификатор строки корзины
  id: string;         // Исходный productId
  name: string;
  price: number;      // Итоговая цена 1 шт. (базовая цена + выбранные допы)
  quantity: number;
  image: string;
  ingredients?: CartIngredient[]; // Список привязанных допов
};

type ServerProduct = {
  id: string;
  name_pt: string;
  currentPrice: number;
  images: { url: string }[];
};

type CartContextType = {
  items: CartItem[];
  addToCart: (p: {
    id: string;
    name: string;
    price: number;
    quantity?: number;
    image: string;
    ingredients?: CartIngredient[];
  }) => void;
  increaseQty: (cartItemId: string) => void;
  decreaseQty: (cartItemId: string) => void;
  removeItem: (cartItemId: string) => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  cartPulse: boolean;
  triggerPulse: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

// Хелпер: генерирует стабильный ключ строки
function generateCartItemId(productId: string, ingredients: CartIngredient[] = []) {
  if (!ingredients.length) return productId;
  const sortedIds = ingredients.map((i) => i.id).sort().join("_");
  return `${productId}-${sortedIds}`;
}

export function CartProvider({
  children,
  products = [],
}: {
  children: React.ReactNode;
  products?: ServerProduct[];
}) {
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
  function clearCart() {
    setItems([]);
  }

  function increaseQty(cartItemId: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  }

  function decreaseQty(cartItemId: string) {
    setItems((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeItem(cartItemId: string) {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  }

  // 🔄 Загрузка из localStorage и синхронизация актуальных цен
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("cart");

    if (saved && products.length > 0) {
      try {
        const localItems = JSON.parse(saved) as any[];

        const freshItems: CartItem[] = localItems.map((localItem) => {
          const actualProduct = products.find((p) => p.id === localItem.id);
          const ingredients: CartIngredient[] = localItem.ingredients || [];

          // Сумма выбранных допов
          const toppingsTotal = ingredients.reduce(
            (sum, ing) => sum + Number(ing.price),
            0,
          );

          // Стабильный cartItemId (для обратной совместимости со старыми корзинами)
          const cartItemId =
            localItem.cartItemId || generateCartItemId(localItem.id, ingredients);

          if (actualProduct) {
            return {
              ...localItem,
              cartItemId,
              ingredients,
              // Свежая цена чебурека + сохраненная цена допов
              price: Number(actualProduct.currentPrice) + toppingsTotal,
              name: actualProduct.name_pt,
              image: actualProduct.images[0]?.url || localItem.image,
            };
          }

          return {
            ...localItem,
            cartItemId,
            ingredients,
          };
        });

        setItems(freshItems);
      } catch {
        setItems([]);
      }
    }
  }, [products]);

  // ➕ Добавление в корзину
  function addToCart(product: {
    id: string;
    name: string;
    price: number;
    quantity?: number;
    image: string;
    ingredients?: CartIngredient[];
  }) {
    const qty = product.quantity ?? 1;
    const ingredients = product.ingredients ?? [];
    const cartItemId = generateCartItemId(product.id, ingredients);

    setItems((prev) => {
      // Ищем, есть ли уже в корзине такой чебурек с РО ВНО таким же набором допов
      const existing = prev.find((i) => i.cartItemId === cartItemId);

      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId
            ? { ...i, quantity: i.quantity + qty }
            : i,
        );
      }

      return [
        ...prev,
        {
          ...product,
          cartItemId,
          ingredients,
          quantity: qty,
        },
      ];
    });

    setCartPulse(true);
    triggerPulse();
  }

  // 💾 Сохранение в localStorage
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



/*"use client";

import { createContext, useContext, useEffect, useState } from "react";
// 1. Импортируйте сюда ваш массив или объект с актуальными товарами
// import { PRODUCTS_DATA } from "@/data/products";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type ServerProduct = {
  id: string;
  name_pt: string;
  currentPrice: number;
  images: { url: string }[];
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

export function CartProvider({
  children,
  products = [],
}: {
  children: React.ReactNode;
  products?: ServerProduct[]; // Принимаем плоский массив товаров с сервера
}) {
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
  function clearCart() {
    setItems([]);
  }

  function increaseQty(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
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

  // 🔄 ОБНОВЛЕННАЯ ЗАГРУЗКА: Проверяем и обновляем цены при старте
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("cart");

    if (saved && products.length > 0) {
      try {
        const localItems = JSON.parse(saved) as CartItem[];
        
        const freshItems = localItems.map((localItem) => {
          // Ищем актуальный товар в массиве, пришедшем с сервера
          const actualProduct = products.find((p) => p.id === localItem.id);
          
          if (actualProduct) {
            return {
              ...localItem,
              price: actualProduct.currentPrice, // Свежая цена с учетом скидок!
              name: actualProduct.name_pt,
              image: actualProduct.images[0]?.url || localItem.image,
            };
          }
          return localItem;
        });

        setItems(freshItems);
      } catch {
        setItems([]);
      }
    }
  }, [products]); // Сработает, когда серверные продукты загрузятся

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

  // 💾 Сохранение в localStorage (у вас в коде было два одинаковых эффекта, оставил один)
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
*/