"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./caruselgsapchild.module.css";

type Props = {
  speed?: number;
  children: React.ReactNode;
};

export default function GsapSlider({ children, speed = 20 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        xPercent: -50, // двигаем на половину (т.к. список продублирован)
        duration: speed, // 👈 меньше = быстрее
        ease: "linear",
        repeat: -1,
      });
    }, el);

    return () => ctx.revert();
  }, [speed]);

  return (
    <div className={styles.viewport}>
      <div
        className={styles.container}
        ref={containerRef}
        onMouseEnter={() => gsap.globalTimeline.pause()}
        onMouseLeave={() => gsap.globalTimeline.resume()}
      >
        {children}
      </div>
    </div>
  );
}
