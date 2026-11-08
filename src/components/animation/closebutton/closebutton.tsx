"use client";

import styles from "./closebutton.module.css";

export default function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button className={styles.button} onClick={onClick} aria-label="Close">
      ✕
    </button>
  );
}