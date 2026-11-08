"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./floatingcartbutton.module.css";
import { useCart } from "@/context/cartcontext";
import ICart from "@/components/iconsvg/icart";
import Cart from "@/components/animation/icons/cart";

export default function FloatingCartButton() {
  const { items, openCart, cartPulse } = useCart();

  const [hovered, setHovered] = useState(false);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  //if (totalCount === 0) return null;

  return (
    <>
      <style>
        {`
          @keyframes cartShake {
            0% {
              transform: scale(1) rotate(0deg);
            }

            20% {
              transform: scale(1.08) rotate(-5deg);
            }

            40% {
              transform: scale(1.12) rotate(5deg);
            }

            60% {
              transform: scale(1.1) rotate(-4deg);
            }

            80% {
              transform: scale(1.05) rotate(2deg);
            }

            100% {
              transform: scale(1) rotate(0deg);
            }
          }
        `}
      </style>

      <motion.div
        onClick={openCart}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{
          width: hovered ? 160 : 60,
          borderRadius: hovered ? 15 : 50,
          background: hovered
            ? "rgba(167, 224, 162, 0.98)"
            : "rgba(167, 224, 162,0.7)",
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 22,
        }}
        style={{}}
        className={styles.main}
      >
        {/* icon */}
        <div
          style={{
            animation: cartPulse ? "cartShake 0.45s ease" : undefined,

            flexShrink: 0,
          }}
          className={styles.icon}
        >
          <Cart name={totalCount} size="40" color="black" />
        </div>

        {/* content */}
        <motion.div
          animate={{
            opacity: hovered ? 1 : 0,
            x: hovered ? 0 : 10,
          }}
          transition={{
            duration: 0.2,
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight:"10px",
            whiteSpace: "nowrap",

            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "black",
            }}
          >
            {totalCount} items
          </div>

          <div
            style={{
              fontSize: 13,
              color: "black",
              marginTop: 2,
            }}
          >
            €{totalPrice.toFixed(2)}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
