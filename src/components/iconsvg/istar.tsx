"use client";
import styles from "./icon.module.css";
import { motion } from "framer-motion";

const IStar = ({ color = "black", size = 50, mirror = 1 }) => (
  <motion.div
    className={styles.iconsvg}
    style={{ color: color, transform: `scaleX(${mirror})` }}
    whileHover={{ color: "var(--green)" }}
  >
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23.0791 21.5441C18.1597 22.6571 15.7 23.2136 15.1148 25.0955C14.5296 26.9773 16.2065 28.9382 19.5602 32.8597L20.4278 33.8745C21.3808 34.9887 21.8573 35.546 22.0717 36.2355C22.2861 36.9247 22.214 37.6682 22.07 39.155L21.9388 40.5088C21.4317 45.7413 21.1782 48.3575 22.7103 49.5205C24.2423 50.6835 26.5452 49.623 31.1512 47.5023L32.343 46.9537C33.6517 46.351 34.3062 46.0498 35 46.0498C35.6937 46.0498 36.3482 46.351 37.657 46.9537L38.8487 47.5023C43.4547 49.623 45.7577 50.6835 47.2897 49.5205C48.8217 48.3575 48.5682 45.7413 48.0612 40.5088M50.4397 32.8597C53.7935 28.9382 55.4702 26.9773 54.8852 25.0955C54.3 23.2136 51.8402 22.6571 46.921 21.5441L45.6482 21.2561C44.2502 20.9398 43.5512 20.7817 42.99 20.3556C42.429 19.9296 42.069 19.2839 41.349 17.9925L40.6937 16.8167C38.1602 12.2722 36.8937 10 35 10C33.1062 10 31.8397 12.2722 29.3062 16.8167"
        stroke="currentColor"
        strokeWidth="3.75"
        strokeLinecap="round"
      />
      <path
        d="M5.22217 40C8.01112 37.8025 11.716 36.9928 15.2222 37.8143"
        stroke="currentColor"
        strokeWidth="3.75"
        strokeLinecap="round"
      />
      <path
        d="M5.22217 26.25C7.72217 25 8.44654 25.1512 10.2222 25"
        stroke="currentColor"
        strokeWidth="3.75"
        strokeLinecap="round"
      />
      <path
        d="M5 14.0217L5.5204 13.7169C11.0346 10.4877 16.8758 9.61718 22.3826 11.204L22.9023 11.3538"
        stroke="currentColor"
        strokeWidth="3.75"
        strokeLinecap="round"
      />
    </svg>
  </motion.div>
);

export default IStar;
