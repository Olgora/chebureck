"use client"
import React from "react";
import styles from "./hovericon.module.css";

type HoverIconProps = {
  text: string;
};

export const HoverIcon: React.FC<HoverIconProps> = ({ text }) => {
  return (
    <div className={styles.hovericon}>
      
      <div className={styles.textwrapper}>
        <span className={styles.textmain}>{text}</span>
        <span className= {styles.textfaded}>{text}</span>
      </div>
    </div>
  );
};
