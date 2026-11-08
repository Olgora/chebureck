"use client";
import styles from "./icon.module.css";
import { motion } from "framer-motion";

const IHeartShine = ({ color = "black", size = 50, rotate = 0 }) => (
  <motion.div
    className={styles.iconsvg}
    style={{ color: color, transform: ` rotate(${rotate}deg)` }}
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
        d="M30 24.7524L28.6385 26.0415C28.9925 26.4155 29.485 26.6275 30 26.6275C30.515 26.6275 31.0075 26.4155 31.3615 26.0415L30 24.7524ZM28.1343 36.9215C26.5525 35.654 25.0187 34.5597 23.7895 33.1527C22.6244 31.819 21.875 30.3457 21.875 28.449H18.125C18.125 31.4957 19.3853 33.8113 20.9654 35.62C22.4815 37.3555 24.4285 38.7573 25.7892 39.8478L28.1343 36.9215ZM21.875 28.449C21.875 26.6617 22.8668 25.2395 24.1027 24.6651C25.2118 24.1498 26.8653 24.1686 28.6385 26.0415L31.3615 23.4633C28.635 20.5836 25.2885 19.979 22.5224 21.2643C19.8833 22.4906 18.125 25.2927 18.125 28.449H21.875ZM25.7892 39.8478C26.291 40.2498 26.9012 40.7383 27.5377 41.1163C28.1725 41.4935 29.0162 41.875 30 41.875V38.125C29.9837 38.125 29.8275 38.1148 29.4528 37.8923C29.0795 37.6705 28.6708 37.3515 28.1343 36.9215L25.7892 39.8478ZM34.2108 39.8478C35.5715 38.7573 37.5185 37.3555 39.0345 35.62C40.6148 33.8113 41.875 31.4957 41.875 28.449H38.125C38.125 30.3457 37.3755 31.819 36.2105 33.1527C34.9812 34.5597 33.4475 35.654 31.8657 36.9215L34.2108 39.8478ZM41.875 28.449C41.875 25.2927 40.1168 22.4906 37.4775 21.2643C34.7115 19.979 31.365 20.5836 28.6385 23.4633L31.3615 26.0415C33.1347 24.1686 34.7883 24.1498 35.8973 24.6651C37.1333 25.2395 38.125 26.6617 38.125 28.449H41.875ZM31.8657 36.9215C31.3292 37.3515 30.9205 37.6705 30.5472 37.8923C30.1725 38.1148 30.0163 38.125 30 38.125V41.875C30.9838 41.875 31.8275 41.4935 32.4623 41.1163C33.0988 40.7383 33.709 40.2498 34.2108 39.8478L31.8657 36.9215Z"
        fill="currentColor"
      />
      <path
        d="M30 5V10"
        stroke="currentColor"
        strokeWidth="3.75"
        strokeLinecap="round"
      />
      <path
        d="M30 50V55"
        stroke="currentColor"
        strokeWidth="3.75"
        strokeLinecap="round"
      />
      <path
        d="M5 30H10"
        stroke="currentColor"
        strokeWidth="3.75"
        strokeLinecap="round"
      />
      <path
        d="M50 30H55"
        stroke="currentColor"
        strokeWidth="3.75"
        strokeLinecap="round"
      />
      <path
        d="M15 45L15.8576 44.1425"
        stroke="currentColor"
        strokeWidth="3.75"
        strokeLinecap="round"
      />
      <path
        d="M44.1418 15.8581L45 15"
        stroke="currentColor"
        strokeWidth="3.75"
        strokeLinecap="round"
      />
      <path
        d="M45 45L44.1425 44.1425"
        stroke="currentColor"
        strokeWidth="3.75"
        strokeLinecap="round"
      />
      <path
        d="M15.8581 15.8581L15 15"
        stroke="currentColor"
        strokeWidth="3.75"
        strokeLinecap="round"
      />
    </svg>
  </motion.div>
);

export default IHeartShine;
