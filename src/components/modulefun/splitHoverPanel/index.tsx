"use client";

import { useRef } from "react";
import { gsap } from "gsap";

type Props = {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  leftBg: React.ReactNode;
  rightBg: React.ReactNode;
  leftTitle?: string;
  rightTitle?: string;
  leftDesc?: string;
  rightDesc?: string;
  width?: string;
  height?: string;
  duration?: number;
};

export default function SplitHoverPanelSequence({
  leftContent,
  rightContent,
  leftBg,
  rightBg,
  leftTitle = "",
  rightTitle = "",
  leftDesc = "",
  rightDesc = "",
  width = "100%",
  height = "400px",
  duration = 0.6,
}: Props) {
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const leftBgRef = useRef<HTMLDivElement | null>(null);
  const rightBgRef = useRef<HTMLDivElement | null>(null);
  const leftTitleRef = useRef<HTMLDivElement | null>(null);
  const rightTitleRef = useRef<HTMLDivElement | null>(null);
  const leftDescRef = useRef<HTMLDivElement | null>(null);
  const rightDescRef = useRef<HTMLDivElement | null>(null);

  const handleHover = (side: "left" | "right") => {
    const tl = gsap.timeline({ defaults: { duration, ease: "power3.out" } });

    if (side === "left" && leftRef.current && rightRef.current && leftBgRef.current && leftTitleRef.current && leftDescRef.current) {
      tl.to(leftRef.current, { flex: 0.7 })
        .to(rightRef.current, { flex: 0.3 }, "<")
        .fromTo(leftBgRef.current, { x: "-100%" }, { x: "0%" }, "<")
        // Название двигается вместе с внутренней границей блока
        .to(leftTitleRef.current, { x: 0, opacity: 1, duration: duration * 0.8 }, "<")
        // Описание выезжает снизу после завершения расширения блока
        .fromTo(leftDescRef.current, { y: "100%", opacity: 0 }, { y: "0%", opacity: 1, duration: duration * 0.8 }, `>0.1`);
    }

    if (side === "right" && leftRef.current && rightRef.current && rightBgRef.current && rightTitleRef.current && rightDescRef.current) {
      tl.to(leftRef.current, { flex: 0.3 })
        .to(rightRef.current, { flex: 0.7 }, "<")
        .fromTo(rightBgRef.current, { x: "100%" }, { x: "0%" }, "<")
        .to(rightTitleRef.current, { x: 0, opacity: 1, duration: duration * 0.8 }, "<")
        .fromTo(rightDescRef.current, { y: "100%", opacity: 0 }, { y: "0%", opacity: 1, duration: duration * 0.8 }, `>0.1`);
    }
  };

  const handleLeave = () => {
    const tl = gsap.timeline({ defaults: { duration, ease: "power3.out" } });

    if (leftRef.current && rightRef.current && leftBgRef.current && rightBgRef.current &&
        leftTitleRef.current && rightTitleRef.current && leftDescRef.current && rightDescRef.current) {
      tl.to(leftRef.current, { flex: 0.5 })
        .to(rightRef.current, { flex: 0.5 }, "<")
        .to(leftBgRef.current, { x: "-100%" }, "<")
        .to(rightBgRef.current, { x: "100%" }, "<")
        .to(leftTitleRef.current, { x: 0, opacity: 0, duration: duration * 0.8 }, "<")
        .to(rightTitleRef.current, { x: 0, opacity: 0, duration: duration * 0.8 }, "<")
        .to(leftDescRef.current, { y: "100%", opacity: 0, duration: duration * 0.8 }, "<0.1")
        .to(rightDescRef.current, { y: "100%", opacity: 0, duration: duration * 0.8 }, "<0.1");
    }
  };

  return (
    <div className="flex overflow-hidden relative" style={{ width, height }}>
      {/* Левая половина */}
      <div
        ref={leftRef}
        className="relative flex-1 cursor-pointer flex items-center justify-center overflow-hidden"
        onMouseEnter={() => handleHover("left")}
        onMouseLeave={handleLeave}
      >
        {/* Фон */}
        <div ref={leftBgRef} className="absolute top-0 left-0 w-full h-full z-0" style={{ transform: "translateX(-100%)" }}>
          {leftBg}
        </div>

        {/* Основной контент */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          {leftContent}
        </div>

        {/* Название и описание внизу */}
        <div className="absolute bottom-0 left-0 w-full text-right z-10 px-4 py-3 flex flex-col items-right">
          <div ref={leftTitleRef} className="text-xl font-bold text-black opacity-0">{leftTitle}</div>
          <div ref={leftDescRef} className="text-white mt-1 opacity-0">{leftDesc}</div>
        </div>
      </div>

      {/* Правая половина */}
      <div
        ref={rightRef}
        className="relative flex-1 cursor-pointer flex items-center justify-center overflow-hidden"
        onMouseEnter={() => handleHover("right")}
        onMouseLeave={handleLeave}
      >
        {/* Фон */}
        <div ref={rightBgRef} className="absolute top-0 left-0 w-full h-full z-0" style={{ transform: "translateX(100%)" }}>
          {rightBg}
        </div>

        {/* Основной контент */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          {rightContent}
        </div>

        {/* Название и описание внизу */}
        <div className="absolute bottom-0 left-0 w-full text-left z-10 px-4 py-3 flex flex-col items-left">
          <div ref={rightTitleRef} className="text-xl font-bold text-black opacity-0">{rightTitle}</div>
          <div ref={rightDescRef} className="text-white mt-1 opacity-0">{rightDesc}</div>
        </div>
      </div>
    </div>
  );
}
