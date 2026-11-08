"use client";
import styles from "./icon.module.css";
import { motion } from "framer-motion";

const Iletter = ({ color = "black", size = 50 }) => (
  <motion.div
    className={styles.iconsvg}
    style={{ color: color }}
    whileHover={{ color: "var(--green)" }}
  >
    <svg
      width={size}
      height={size}
      preserveAspectRatio="none"
      viewBox="0 0 24 24"
      //viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.91602 11.4997C1.91602 7.88557 1.91602 6.07853 3.03877 4.95576C4.16153 3.83301 5.96858 3.83301 9.58268 3.83301H13.416C17.0301 3.83301 18.8372 3.83301 19.9599 4.95576C21.0827 6.07853 21.0827 7.88557 21.0827 11.4997C21.0827 15.1137 21.0827 16.9209 19.9599 18.0436C18.8372 19.1663 17.0301 19.1663 13.416 19.1663H9.58268C5.96858 19.1663 4.16153 19.1663 3.03877 18.0436C1.91602 16.9209 1.91602 15.1137 1.91602 11.4997Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5.75 7.66699L7.81895 9.39111C9.57905 10.8579 10.4592 11.5913 11.5 11.5913C12.5408 11.5913 13.421 10.8579 15.1811 9.39111L17.25 7.66699"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  </motion.div>
);

export default Iletter;
