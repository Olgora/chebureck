"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import styles from "./caruselgsap.module.css";

type Props = {
  list: string[];
  speed?: number; // 👈 регулируешь скорость
};

export default function GsapSlider({ list, speed = 20 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        xPercent: -50,          // двигаем на половину (т.к. список продублирован)
        duration: speed,        // 👈 меньше = быстрее
        ease: "linear",
        repeat: -1,
      });
    }, el);

    return () => ctx.revert();
  }, [speed]);

  const doubled = [...list, ...list]; // 🔁 ключ к бесшовности

  return (
    <div className={styles.viewport}>
      <div
        className={styles.container}
        ref={containerRef}
        onMouseEnter={() => gsap.globalTimeline.pause()}
        onMouseLeave={() => gsap.globalTimeline.resume()}
      >
        {doubled.map((item, i) => (
          <div className={styles.slide} key={i}>
            <Image src={item} alt="" width={300} height={300} />
          </div>
        ))}
      </div>
    </div>
  );
}