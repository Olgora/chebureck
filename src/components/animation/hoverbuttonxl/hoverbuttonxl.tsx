import React from "react";
import styles from "./hoverbuttonxl.module.css";
import { motion } from "framer-motion";
import { ReactNode } from "react";

type FancyButtonProps = {
  name?:ReactNode;
  baseColor?: string;
  hoverColor?: string;
  borderColor?: string;
  wsize?: string; // 👈 только pxsize?:
  hsize?: string; // 👈 только px
  disabled?: boolean;
  borderradius: string;
  borderColorhover?: string;
  opacity?:number;
  colorFont?:string;

  onClick?: () => void;
};

export const FancyButtonXL: React.FC<FancyButtonProps> = ({
  baseColor = "#111",
  hoverColor = "#e67e22",
  borderColor = "black",
  borderColorhover = "black",
  colorFont = "black",
  name,
  wsize = 50,
  hsize = 50,
  disabled = false,
  borderradius = 20,
  opacity = 1,
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
      <div
        className={styles.inner}
        style={{
          width: wsize,
          height: hsize,
        }}
      >
        <motion.div
          className={styles.top}
          style={{
            backgroundColor: baseColor,
            borderRadius: borderradius,
            borderColor: borderColor,
            color: colorFont,
            opacity:opacity,
            
          }}
          whileHover={{
            borderColor: borderColorhover,
            color: borderColorhover,
            opacity:1
          }}
        >
          {name}
        </motion.div>

        <div
          className={styles.bottom}
          style={{
            backgroundColor: hoverColor,
            borderRadius: borderradius,
          }}
        ></div>
      </div>
    </button>
  );
};
