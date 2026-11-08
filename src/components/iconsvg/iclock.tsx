"use client";
import styles from "./icon.module.css";
import { motion } from "framer-motion";

const IClock = ({ color = "black", size = 50, rotate = 0 }) => (
  <motion.div
    className={styles.iconsvg}
    style={{ color: color, transform: ` rotate(${rotate}deg)` }}
    whileHover={{ color: "var(--green)" }}
  >
    <svg
      width="54"
      height="55"
      viewBox="0 0 54 55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.8439 4.63949C18.5523 2.58556 22.7556 1.5 27 1.5C41.0611 1.5 52.5 13.1637 52.5 27.5C52.5 41.8362 41.0606 53.5 27 53.5C12.9392 53.5 1.5 41.8366 1.5 27.5003C1.5 22.2907 3.00657 17.2632 5.85639 12.9625"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M34.8818 31.2143H28.2038C26.7101 31.2143 25.5 30.1428 25.5 28.8214V15.5"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  </motion.div>
);

export default IClock;
