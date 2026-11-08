"use client";

import { motion } from "framer-motion";

export default function FreeShippingSection({
  cartTotal = 32,
  threshold = 50,
  currency = "€",
}) {
  const progress = Math.min(cartTotal / threshold, 1);
  const percent = progress * 100;
  const remaining = Math.max(threshold - cartTotal, 0);
  const isComplete = cartTotal >= threshold;

  return (
    <div className="w-full max-w-xl rounded-2xl border bg-white shadow-sm p-5">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Доставка
          </h3>

          <p className="text-sm text-gray-600 mt-1">
            {isComplete ? (
              <span className="text-green-600 font-medium">
                🎉 Бесплатная доставка активирована
              </span>
            ) : (
              <>
                Добавьте ещё{" "}
                <span className="font-semibold text-gray-900">
                  {remaining.toFixed(2)}{currency}
                </span>{" "}
                до бесплатной доставки
              </>
            )}
          </p>
        </div>

        <div className="text-sm font-semibold text-gray-900">
          {cartTotal.toFixed(2)}{currency} / {threshold}{currency}
        </div>
      </div>

      {/* Track */}
      <div className="relative h-3 w-full rounded-full bg-gray-200 overflow-hidden">
        
        {/* Fill */}
        <motion.div
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600"
        />

        {/* Truck */}
        <motion.div
          initial={false}
          animate={{ left: `calc(${percent}% - 14px)` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute top-[-14px] text-xl drop-shadow"
        >
          🚚
        </motion.div>
      </div>

      {/* Milestones */}
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>0{currency}</span>
        <span>{threshold / 2}{currency}</span>
        <span>{threshold}{currency}</span>
      </div>

      {/* CTA hint */}
      <div className="mt-4 text-xs text-gray-500">
        {isComplete ? (
          "Доставка будет рассчитана бесплатно при оформлении заказа"
        ) : (
          "Добавляйте товары в корзину — доставка станет бесплатной автоматически"
        )}
      </div>
    </div>
  );
}

/*

*/