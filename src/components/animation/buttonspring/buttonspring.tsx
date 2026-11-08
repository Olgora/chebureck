"use client";

import { ReactNode } from "react";
import { motion, useAnimationControls } from "framer-motion";

type Buttonspring = {
  icon: ReactNode;
  onClick?: () => void;
};

export default function Buttonspring({
  icon,

  onClick,
}: Buttonspring) {
  const iconControls = useAnimationControls();

  const handleHover = async () => {
    // не даём запускать поверх предыдущей анимации
    iconControls.stop();

    await iconControls.start({
      scaleX: 0.55,
      scaleY: 1.35,
      y: -6,
      transition: { duration: 0.12 },
    });

    await iconControls.start({
      scaleX: 1.12,
      scaleY: 0.92,
      y: -2,
      transition: { duration: 0.12 },
    });

    iconControls.start({
      scaleX: 1,
      scaleY: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 700,
        damping: 18,
      },
    });
  };

  return (
    <motion.button
      onMouseEnter={handleHover}
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      style={{
        position: "relative",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        padding: 0,
        margin: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Иконка */}
      <motion.div
        animate={iconControls}
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </motion.div>
    </motion.button>
  );
}
