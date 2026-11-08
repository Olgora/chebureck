"use client";
import styles from "./icon.module.css";
import { motion } from "framer-motion";

const IPin = ({ color = "white", size = 70, coloract = "orange" }) => (
  <motion.div
    className={styles.iconsvg}
    style={{ color: color, position: "relative", fontSize: "15px" }}
    whileHover={{ color: coloract }}
  >
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30 52.5C38.75 43.5 47.5 35.441 47.5 25.5C47.5 15.5589 39.665 7.5 30 7.5C20.335 7.5 12.5 15.5589 12.5 25.5C12.5 35.441 21.25 43.5 30 52.5Z"
        stroke="currentColor"
        strokeWidth="4.5"
      />
      <path
        d="M30 30C32.7615 30 35 27.7615 35 25C35 22.2386 32.7615 20 30 20C27.2385 20 25 22.2386 25 25C25 27.7615 27.2385 30 30 30Z"
        stroke="currentColor"
        strokeWidth="4.5"
      />
    </svg>
  </motion.div>
);

export default IPin;
