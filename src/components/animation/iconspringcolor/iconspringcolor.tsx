"use client";

import { ReactNode } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";

type BlobIconButtonProps = {
  icon: ReactNode;
  size?: number;
  blobColor?: string;
  onHover?: boolean;
  onHoverTrigger?: number;
};

export default function BlobIcon({
  icon,
  size = 60,
  blobColor = "#A7E0A2",
  onHover,
  onHoverTrigger
}: BlobIconButtonProps) {
  const iconControls = useAnimationControls();
  const blobControls = useAnimationControls();

useEffect(() => {
  if (!onHover) return;

  const run = async () => {
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

  run();
}, [onHover]);



  const handleHover = async () => {
    // не даём запускать поверх предыдущей анимации
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
    <motion.button
     
      whileTap={{ scale: 0.92 }}
      style={{
        position: "relative",
        width: size,
        height: size,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        padding: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Живая капля */}
      <motion.div
        animate={blobControls}
        style={{
          position: "absolute",
          width: size * 0.8,
          height: size * 0.8,
          background: blobColor,
          backdropFilter: "blur(6px)",
          borderRadius: "50%",
          zIndex: 0,
          right: "-4px",
          bottom: "0",
        }}
      >
        <motion.div
          style={{
            width: "100%",
            height: "100%",
            background: blobColor,
            borderRadius: "58% 42% 65% 35%",
          }}
          animate={{
            borderRadius: [
              "58% 42% 65% 35% / 42% 58% 38% 62%",
              "42% 58% 35% 65% / 60% 40% 55% 45%",
              "62% 38% 52% 48% / 35% 65% 42% 58%",
              "58% 42% 65% 35% / 42% 58% 38% 62%",
            ],
          }}
          transition={{
            duration: 8,
            repeat: 1,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Иконка */}
      <motion.div
        animate={iconControls}
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </motion.div>
    </motion.button>
  );
}
