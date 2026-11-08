"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./runline.module.css";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number; // Скорость в пикселях в секунду (например: 100 - плавно, 200 - быстрее)
  direction?: "left" | "right";
  gap?: number; // Отступ между элементами в пикселях
  repeatCount?: number; // Сколько раз продублировать пачку элементов внутри ОДНОГО трека
  fontsize?: string;
  letterspacing?: number;
}

export const Marquee: React.FC<MarqueeProps> = ({
  children,
  speed = 100, // Теперь это px/секунду. Направление вправо и влево будет с одинаковой скоростью
  direction = "left",
  gap = 30,
  repeatCount = 3, // 3-4 повторений достаточно, чтобы заполнить экран
  fontsize = "2rem",
  letterspacing = 5,
}) => {
  const tickerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ticker = tickerRef.current;
    const track = trackRef.current;
    if (!ticker || !track) return;

    const isLeft = direction === "left";

    // Измеряем точную физическую ширину ОДНОГО трека в пикселях
    const trackWidth = track.offsetWidth;

    // Рассчитываем время анимации исходя из ширины трека и скорости (px/sec)
    const duration = trackWidth / speed;

    // Точные пиксельные координаты для бесшовного зацикливания
    const startX = isLeft ? 0 : -trackWidth;
    const endX = isLeft ? -trackWidth : 0;

    const ctx = gsap.context(() => {
      // Сбрасываем начальное положение контейнера в пикселях
      gsap.set(ticker, { x: startX });

      // Запускаем линейную анимацию по пикселям
      gsap.to(ticker, {
        x: endX,
        duration: duration,
        ease: "none",
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, [speed, direction, children, gap, repeatCount]); // Пересчитываем при изменении контента или направления

  const itemsArray = Array.from({ length: repeatCount });

  // Функция рендерит один трек
  const renderTrack = (isFirst: boolean) => (
    <div
      /* Вешаем реф только на первый трек, чтобы узнать его точную ширину */
      ref={isFirst ? trackRef : null}
      className={styles.track}
    >
      {itemsArray.map((_, outerIndex) => (
        <React.Fragment key={outerIndex}>
          {React.Children.map(children, (child, innerIndex) => (
            <div
              className={styles.item}
              style={{ paddingRight: `${gap}px`, fontSize:fontsize, letterSpacing:letterspacing}}
              key={`${outerIndex}-${innerIndex}`}
            >
              {child}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      <div ref={tickerRef} className={styles.ticker}>
        {/* Первый трек (оригинал) */}
        {renderTrack(true)}

        {/* Второй трек (копия для склейки) */}
        {renderTrack(false)}

        {/* Второй трек (копия для склейки) */}
        {renderTrack(false)}
      </div>
    </div>
  );
};
