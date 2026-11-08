"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type UnderlineProps = {
  children: ReactNode;
};

export default function Underline({ children }:UnderlineProps) {
  return (
    <motion.span
      className="relative inline-block cursor-pointer"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      {children}

      <motion.span
        className="absolute left-0 bottom-0 h-[2px] w-full bg-white origin-left"
        variants={{
          rest: { scaleX: 0 },
          hover: { scaleX: 1 },
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
    </motion.span>
  );
}