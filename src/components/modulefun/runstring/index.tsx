"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./index.module.css";

gsap.registerPlugin(ScrollTrigger);

type TProps = {
  childrenRow1: ReactNode;
  childrenRow2: ReactNode;
  gap: number;
  /** Дистанция сдвига в px на десктопе. По умолчанию 500 — как было. */
  distance?: number;
  /** Дистанция сдвига в px на мобильном (≤640px). Если не задать —
      берётся ~40% от distance, чтобе движение не выглядело слишком
      резким/быстрым на узком экране при том же scrub. */
  distanceMobile?: number;
};

export default function DualScrollMarquee({
  childrenRow1,
  childrenRow2,
  gap,
  distance = 900,
  distanceMobile,
}: TProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const row1 = container.querySelector(".marquee-row1")!;
    const row2 = container.querySelector(".marquee-row2")!;

    // Пересчитываем дистанцию под текущую ширину экрана один раз при монтировании.
    // matchMedia, а не resize-слушатель — раз анимация привязана к scroll
    // и пересоздаётся при каждом монтировании компонента, нам достаточно
    // знать актуальную ширину на момент инициализации ScrollTrigger.
    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const activeDistance = isMobile
      ? distanceMobile ?? Math.round(distance * 0.4)
      : distance;

    // Начальные позиции
    gsap.set(row1, { x: 0 });
    gsap.set(row2, { x: -activeDistance });

    const tl1 = gsap.to(row1, {
      x: `-=${activeDistance}`,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 2,
      },
    });

    const tl2 = gsap.to(row2, {
      x: `+=${activeDistance}`,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 2,
      },
    });

    // Чистим ScrollTrigger при размонтировании — иначе при переходах между
    // страницами (Next.js) триггеры накапливаются и начинают конфликтовать.
    return () => {
      tl1.scrollTrigger?.kill();
      tl2.scrollTrigger?.kill();
      tl1.kill();
      tl2.kill();
    };
  }, [distance, distanceMobile]);

  return (
    <div ref={containerRef} className={styles.container}>
      <div
        className={`${styles.row} marquee-row1`}
        style={{ marginBottom: gap }}
      >
        {childrenRow1}
      </div>

      <div className={`${styles.row} marquee-row2`}>{childrenRow2}</div>
    </div>
  );
}
