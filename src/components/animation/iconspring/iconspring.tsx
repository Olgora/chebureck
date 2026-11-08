"use client";

"use client";

import { motion, useAnimationControls } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  size?: number;
  onClick?: () => void;
};

export default function IconSpringButton({
  icon,
  size = 40,
  onClick,
}: Props) {
  const controls = useAnimationControls();

  const handleHover = () => {
    controls
      .start({
        scaleX: 0.55,
        scaleY: 1.35,
        y: -6,
        transition: { duration: 0.12 },
      })
      .then(() => {
        return controls.start({
          scaleX: 1.15,
          scaleY: 0.95,
          y: -2,
          transition: { duration: 0.12 },
        });
      })
      .then(() => {
        return controls.start({
          scaleX: 1,
          scaleY: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 600,
            damping: 18,
          },
        });
      });
  };

  return (
    <motion.button
      onMouseEnter={handleHover}
      onClick={onClick}
      animate={controls}
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
         
        cursor: "pointer",
        padding: 0,
        margin:0

            }}
      whileTap={{ scale: 0.9 }}
    >
      {icon}
    </motion.button>
  );
}