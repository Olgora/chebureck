"use client";

import { ReactNode } from "react";
import { motion, useAnimationControls } from "framer-motion";
import styles from "./promoblock.module.css";
import { useState } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  description: string;
  blobColor?: string;
  linecolor: string;
  textcolor: string;
};

export default function PromoCard({
  icon,
  title,
  description,
  blobColor = "#A7E0A2",
  linecolor = "#A7E0A2",
  textcolor = "#A7E0A2",
}: Props) {
  const iconControls = useAnimationControls();
  const blobControls = useAnimationControls();
  const [hovered, setHovered] = useState(false);

  const handleHover = async () => {
    setHovered(true);

    iconControls.stop();
    blobControls.stop();

    blobControls.start({
      scaleX: 0.8,
      scaleY: 1.25,
      rotate: -8,
      transition: { duration: 0.12 },
    });

    await iconControls.start({
      scaleX: 0.55,
      scaleY: 1.35,
      y: -6,
      transition: { duration: 0.12 },
    });

    blobControls.start({
      scaleX: 1.08,
      scaleY: 0.95,
      rotate: 4,
      transition: { duration: 0.12 },
    });

    await iconControls.start({
      scaleX: 1.12,
      scaleY: 0.92,
      y: -2,
      transition: { duration: 0.12 },
    });

    blobControls.start({
      scaleX: 1,
      scaleY: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 14,
      },
    });

    iconControls.start({
      scaleX: 1,
      scaleY: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 700,
        damping: 18,
      },
    });
  };

  return (
    <motion.div
      className={styles.main}
      onMouseEnter={handleHover}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <motion.div
            className={styles.blob}
            animate={blobControls}
            style={{ background: blobColor }}
          />

          <motion.div className={styles.icon} animate={iconControls}>
            {icon}
          </motion.div>
        </div>
        <div className={styles.title} style={{ color: textcolor }}>
          <h3 style={{ color: textcolor }}>{title}</h3>
          <p className={styles.description}>{description}</p>
          <motion.div
            className={styles.line}
            style={{ backgroundColor: linecolor }}
            variants={{
              rest: { scaleX: 0 },
              hover: {
                scaleX: 1,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                },
              },
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
