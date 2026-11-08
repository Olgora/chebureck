"use client";
import React from "react";
import styles from "./hovertext.module.css";

type HoverIconProps = {
  text: string;
  textL: string;
};

export const HoverText: React.FC<HoverIconProps> = ({ text, textL }) => {
  return (
    <div className={styles.hovericon}>
      <span>{text}</span>
      <span className={styles.tooltip}>{textL}</span>
    </div>
  );
};
