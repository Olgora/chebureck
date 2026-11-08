"use client";

import styles from "./icon.module.css";
import { motion } from "framer-motion";
import { Geist } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const ICart = ({
  color = "white",
  size = 70,
  coloract = "orange",
  col = 0,
}) => {
  return (
    <motion.div
      className={`${geistSans.className} ${styles.iconsvgcart}`}
      style={{
        position: "relative",
        display: "inline-flex",
        color,
        fill:color
      }}
      whileHover={{
        scale: 1.05,
        color: coloract,
        fill:coloract
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 60 88"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M29.4104 22.1666V28.524C29.4105 31.4119 32.2504 33.5952 35.5197 33.5953C38.7891 33.5953 41.6299 31.412 41.6301 28.524V22.1666H46.2404V28.524C46.2402 33.1981 41.5304 37.1666 35.5197 37.1666C29.5092 37.1665 24.8002 33.198 24.8 28.524V22.1666H29.4104Z" />
        <path d="M59.5 7.5V73C59.5 74.9263 58.9514 76.6574 58.0918 77.8936C57.2305 79.1321 56.092 79.8329 54.9004 79.833H14.0996C12.908 79.8329 11.7695 79.1321 10.9082 77.8936C10.0486 76.6574 9.5 74.9263 9.5 73V7.5H59.5ZM13.5996 73.5H55.4004V13.833H13.5996V73.5Z" />
      </svg>

      {/* badge */}
      {col > 0 && (
        <div
          style={{
            position: "absolute",
            top: 25,
            right: 14,
            minWidth: 20,
            height: 20,
            borderRadius: 999,
             
            color: "black",
            fontSize: 14,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 6px",
          }}
        >
          {col}
        </div>
      )}
    </motion.div>
  );
};

export default ICart;