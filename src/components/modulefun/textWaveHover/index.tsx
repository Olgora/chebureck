"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";

type Props = {
  text: string;
  amplitude?: number; // высота волны
  duration?: number;  // скорость анимации
};

export default function TextWaveHover({
  text,
  amplitude = 10,
  duration = 0.4,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [lastY, setLastY] = useState<number | null>(null);
  const [direction, setDirection] = useState<"up" | "down">("up");

  const letters = text.split("").map((char, i) => (
    <span
      key={i}
      style={{ display: "inline-block" }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));

  const animateWave = (dir: "up" | "down") => {
    if (!containerRef.current) return;
    const spans = containerRef.current.querySelectorAll("span");

    spans.forEach((span, i) => {
      const offset =
        Math.sin((i / spans.length) * Math.PI) * amplitude * (dir === "up" ? -1 : 1);
      gsap.to(span, { y: offset, duration, ease: "power2.out" });
    });
  };

  const resetWave = () => {
    if (!containerRef.current) return;
    const spans = containerRef.current.querySelectorAll("span");
    spans.forEach((span) => {
      gsap.to(span, { y: 0, duration, ease: "power2.out" });
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (lastY !== null) {
      const deltaY = e.clientY - lastY;
      if (Math.abs(deltaY) > 2) {
        const dir = deltaY > 0 ? "down" : "up";
        if (dir !== direction) {
          setDirection(dir);
          animateWave(dir);
        }
      }
    }
    setLastY(e.clientY);
  };

  const handleMouseLeave = () => {
    resetWave();
    setLastY(null);
  };

  return (
    <div
      ref={containerRef}
      className="inline-block cursor-pointer select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {letters}
    </div>
  );
}
