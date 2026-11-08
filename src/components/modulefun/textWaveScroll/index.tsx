"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

type Props = {
  text: string;
  amplitude?: number; // высота волны
  duration?: number;  // скорость анимации
  fontSize: number 
};

export default function TextWaveScroll({
  text,
  amplitude = 20,
  duration = 0.4,
  fontSize = 50
  
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [lastScroll, setLastScroll] = useState<number | null>(null);
  const [direction, setDirection] = useState<"up" | "down">("up");

  // разбиваем текст на спаны
  const letters = text.split("").map((char, i) => (
    <span key={i} style={{ display: "inline-block" }}>
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

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (lastScroll !== null) {
        const delta = currentY - lastScroll;
        if (Math.abs(delta) > 2) {
          const dir = delta > 0 ? "down" : "up";
          if (dir !== direction) {
            setDirection(dir);
            animateWave(dir);
          }
        }
      }
      setLastScroll(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      resetWave();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastScroll, direction]);

  return (
    <div ref={containerRef} className="inline-block select-none font-bold" style={{
    display: "inline-block",
    fontSize: fontSize || 24,
     
  }} >
      {letters}
    </div>
  );
}
