"use client";
import styles from "./icon.module.css";
import { motion } from "framer-motion";
const Imenu = ({ color = "black", size = 50 }) => (
  <motion.div
    className={styles.iconsvg}
    style={{ color: color }}
    whileHover={{ color: "var(--green)" }}
  >
    <svg
      width={size}
      height={size}
      viewBox="0 0 54 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 26L43.0167 26.0264"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M13 35L43.0167 35.0264"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M13 17L43.0167 17.0264"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  </motion.div>
);

export default Imenu;
