"use client";
import styles from "./icon.module.css";
import { motion } from "framer-motion";

const ICard = ({ color = "black", size = 50, rotate = 0 }) => (
  <motion.div
    className={styles.iconsvg}
    style={{ color: color, transform: ` rotate(${rotate}deg)` }}
    whileHover={{ color: "var(--green)" }}
  >
    <svg
      width="68"
      height="56"
      viewBox="0 0 68 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M59.5 28V32.6667M59.5 32.6667V39.6667C59.5 42.2441 56.963 44.3334 53.8333 44.3334H14.1667C11.0371 44.3334 8.5 42.2441 8.5 39.6667V32.6667M59.5 32.6667H8.5M34 14H14.1667C11.0371 14 8.5 16.0894 8.5 18.6667V32.6667M65.1667 9.33337L51 21L45.3333 16.3334"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </motion.div>
);

export default ICard;
