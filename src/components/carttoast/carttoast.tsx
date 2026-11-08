"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type CartToastContextType = {
  showToast: (message: string) => void;
};

const CartToastContext = createContext<CartToastContextType | null>(null);

export function CartToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const showToast = useCallback((message: string) => {
    setMessage(message);
    setVisible(true);

    setTimeout(() => {
      setVisible(false);
    }, 1500);
  }, []);

  const value = useMemo(
    () => ({
      showToast,
    }),
    [showToast]
  );

  return (
    <CartToastContext.Provider value={value}>
      {children}

      <div
        className={`
          fixed left-1/2 bottom-6 z-9999
          -translate-x-1/2
          transition-all duration-300
          ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0 pointer-events-none"
          }
        `}
      >
        <div className="bg-black text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium">
          {message}
        </div>
      </div>
    </CartToastContext.Provider>
  );
}

export function useCartToast() {
  const context = useContext(CartToastContext);

  if (!context) {
    throw new Error("useCartToast must be used inside CartToastProvider");
  }

  return context;
}