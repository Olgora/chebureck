import React from "react";
import styles from "./hoverbutton.module.css";

type FancyButtonProps = {
  tooltip: string;
  Icon: React.ReactNode;

  baseColor?: string;
  hoverColor?: string;

  wsize?: string; // 👈 только pxsize?:
  hsize?: string; // 👈 только px
  disabled?: boolean;

  onClick?: () => void;
};

export const FancyButton: React.FC<FancyButtonProps> = ({
  tooltip,
  Icon,
  baseColor = "#111",
  hoverColor = "#e67e22",
  wsize = 50,
  hsize = 50,
  disabled = false,
  onClick,
}) => {
  return (
    <button
      className={styles.btn}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: wsize,
        height: hsize,
      }}
    >
      <span className={styles.tooltip}>{tooltip}</span>

      <div
        className={styles.inner}
        style={{
          width: wsize,
          height: hsize,
        }}
      >
        <div className={styles.top} style={{ backgroundColor: baseColor }}>
          {Icon }
        </div>

        <div className={styles.bottom} style={{ backgroundColor: hoverColor }}>
          {Icon}
        </div>
      </div>
    </button>
  );
};
