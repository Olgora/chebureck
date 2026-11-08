"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/context/diccontext";
import styles from "./freeshipingbar.module.css";

export default function FreeShippingSection({
  cartTotal = 32,
  threshold = 50,
  currency = "€",
}) {
  const progress = Math.min(cartTotal / threshold, 1);
  const percent = progress * 100;
  const remaining = Math.max(threshold - cartTotal, 0);
  const isComplete = cartTotal >= threshold;
  const { dictionary } = useI18n();

  return (
    <div className="w-full max-w-xl  not-[]:">
      {/* Header */}
      <div className={styles.main}>
        <div>
          <p className={styles.block}>
            {isComplete ? (
              <span className="text-green-600 font-medium">
                {dictionary.freeshippingsection.line_2}
              </span>
            ) : (
              <span className={styles.text}>
                {dictionary.freeshippingsection.line_1_1}
                {"        "}
                {remaining.toFixed(2)}
                {currency}
                 {"       "}
                {dictionary.freeshippingsection.line_1_2}
              </span>
            )}
          </p>
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
      </div>
    </div>
  );
}
