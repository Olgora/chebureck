"use client";

import React, { useLayoutEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import styles from "./runcurveblock.module.css";

interface CurveMarqueeProps {
  text: string;
  speed?: number;
  amplitude?: number;
  frequency?: number;
  direction?: "left" | "right";
  fontsize?: string;
  color?: string;
  bgColor?: string;
  bgWidth?: number;
  letterspacing?: number;
}

const SEPARATOR = "       ";

export const CurveMarqueeBlock: React.FC<CurveMarqueeProps> = ({
  text,
  speed = 20,
  amplitude = 40,
  frequency = 3,
  direction = "left",
  fontsize = "32px",
  color = "white",
  bgColor = "#ff0055",
  bgWidth = 60,
  letterspacing = 5,
}) => {
  const textPathRef = useRef<SVGTextPathElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  // скрытый эталон "одна копия текста + разделитель" — по нему меряем шаг цикла
  const unitRef = useRef<SVGTextElement>(null);

  // с запасом — важно, чтобы видимой длины хватало на весь путь при любой ширине экрана
  const fullText = Array(15).fill(text).join(SEPARATOR);

  const svgPath = useMemo(() => {
    const width = 2800;
    const midY = 100;
    const pointsCount = frequency * 2;
    const stepX = width / pointsCount;

    let path = `M 0,${midY}`;

    for (let i = 0; i < pointsCount; i++) {
      const nextX = (i + 1) * stepX;
      const controlY = midY + (i % 2 === 0 ? -amplitude : amplitude);
      path += ` Q ${(i * stepX) + stepX / 2},${controlY} ${nextX},${midY}`;
    }

    return path;
  }, [amplitude, frequency]);

  useLayoutEffect(() => {
    const textPath = textPathRef.current;
    const pathEl = pathRef.current;
    const unitEl = unitRef.current;
    if (!textPath || !pathEl || !unitEl) return;

    let tl: gsap.core.Tween | null = null;

    // ждём загрузки шрифтов — иначе метрики могут посчитаться по фолбэк-шрифту
    // и после подгрузки нужного шрифта шаг цикла слегка "поплывёт"
    const setup = () => {
      const totalPathLength = pathEl.getTotalLength();
      const unitLength = unitEl.getComputedTextLength();

      // защита от деления на 0 / некорректных измерений
      if (!totalPathLength || !unitLength) return;

      // процент пути, который занимает ОДИН повтор текста —
      // именно на этот шаг двигаем startOffset, а не на все 100%
      const loopPercent = (unitLength / totalPathLength) * 100;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const startVal = direction === "left" ? "0%" : `-${loopPercent}%`;
      const endVal = direction === "left" ? `-${loopPercent}%` : "0%";

      gsap.set(textPath, { attr: { startOffset: startVal } });

      if (prefersReducedMotion) return;

      // длительность одного шага пропорциональна его доле от полного круга,
      // чтобы визуальная скорость не зависела от того, сколько текста поместилось
      const stepDuration = speed * (loopPercent / 100);

      tl = gsap.to(textPath, {
        attr: { startOffset: endVal },
        duration: stepDuration,
        ease: "none",
        repeat: -1,
      });
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(setup);
    } else {
      setup();
    }

    return () => {
      tl?.kill();
    };
  }, [speed, direction, text, fontsize, letterspacing]);

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.svg}
        viewBox="0 0 1400 200"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <path ref={pathRef} id="dynamicWavePath" d={svgPath} fill="none" />
        </defs>

        <use
          href="#dynamicWavePath"
          stroke={bgColor}
          strokeWidth={bgWidth}
          strokeLinecap="round"
          fill="none"
        />

        {/* эталон для измерения длины одного повтора — не рендерится видимо */}
        <text
          ref={unitRef}
          className={styles.text}
          style={
            {
              "--fontsize": fontsize,
              "--letterspacing": `${letterspacing}px`,
            } as React.CSSProperties
          }
          opacity={0}
          aria-hidden="true"
        >
          {text + SEPARATOR}
        </text>

        <text
          className={styles.text}
          fill={color}
          style={
            {
              "--fontsize": fontsize,
              "--letterspacing": `${letterspacing}px`,
            } as React.CSSProperties
          }
          dy="10"
        >
          <textPath ref={textPathRef} href="#dynamicWavePath">
            {fullText}
          </textPath>
        </text>
      </svg>
    </div>
  );
};