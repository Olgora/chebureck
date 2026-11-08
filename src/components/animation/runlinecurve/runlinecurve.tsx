"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./runlinecurve.module.css";

interface CurveMarqueeProps {
  text: string;
  speed?: number; // Скорость движения (px в секунду)
  amplitude?: number; // Высота изгиба волны (в пикселях)
  frequency?: number; // Частота волны
  gap?: number; // Отступ между буквами (в пикселях)
  repeat?: number; // Сколько раз повторить строку для бесконечности
  direction?: "left" | "right"; // Направление движения
  fontsize: string;
  color: string;
   
}

export const CurveMarquee: React.FC<CurveMarqueeProps> = ({
  text,
  speed = 80,
  amplitude = 30,
  frequency = 0.006,
  gap = 14,
  repeat = 4,
  direction = "right", // По умолчанию движемся влево
  fontsize = "3rem",
  color = "white",
  
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<HTMLSpanElement[]>([]);

  // Дублируем текст, чтобы заполнить экран
  const fullText = Array(repeat).fill(text).join("   ");
  const chars = fullText.split("");

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const charElements = charRefs.current.filter(Boolean);
    if (charElements.length === 0) return;

    const ctx = gsap.context(() => {
      let totalWidth = 0;
      const positions: number[] = [];

      // 1. Измеряем буквы и расставляем их на стартовые позиции
      charElements.forEach((char, index) => {
        gsap.set(char, { x: totalWidth, yPercent: -50 });
        positions[index] = totalWidth;
        totalWidth += char.offsetWidth + gap;
      });

      const totalDuration = totalWidth / speed;
      const isLeft = direction === "left";

      // 2. Анимация
      charElements.forEach((char, index) => {
        // Задаем вектор движения в зависимости от направления
        const moveTarget = isLeft ? `-=${totalWidth}` : `+=${totalWidth}`;

        gsap.to(char, {
          x: moveTarget,
          ease: "none",
          duration: totalDuration,
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize((xRaw) => {
              let x = parseFloat(xRaw);

              // Математический трюк для бесшовного зацикливания в обе стороны:
              // Оператор остатка от деления (%) в JS с отрицательными числами ведет себя специфически,
              // поэтому используем двойное прибавление totalWidth для компенсации движения вправо.
              x = ((x % totalWidth) + totalWidth) % totalWidth;

              // Вычисляем синусоиду (высоту Y) на основе текущего положения X
              const y = Math.sin(x * frequency) * amplitude;
              gsap.set(char, { y: y });

              return x;
            }),
          },
        });
      });
    });

    return () => ctx.revert();
  }, [text, speed, amplitude, frequency, gap, repeat, direction]);

  return (
    <div ref={containerRef} className={styles.container}>
      {chars.map((char, index) => (
        <span
          key={index}
          className={styles.char}
          style={{ color: color, fontSize: fontsize }}
          ref={(el) => {
            if (el) charRefs.current[index] = el;
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
};
