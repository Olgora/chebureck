"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type HorizontalScrollSectionProps = {
  panels: React.ReactNode[];
  scrub?: number;
  scaleFactor?: number; // степень увеличения активной панели
};

export default function HorizontalScrollSection({
  panels,
  scrub = 1.2,
  scaleFactor = 1.15,
}: HorizontalScrollSectionProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const totalWidth = track.scrollWidth - section.clientWidth;

    // Основное горизонтальное движение
    const scrollTween = gsap.to(track, {
      x: () => -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${totalWidth}`,
        pin: true,
        scrub,
        anticipatePin: 1,
      },
    });

    // Эффект масштабирования для каждой панели
    const panelsEls = gsap.utils.toArray<HTMLDivElement>(".panel");

    panelsEls.forEach((panel) => {
      gsap.to(panel, {
        scale: scaleFactor,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: panel,
          containerAnimation: scrollTween,
          start: "center center",
          end: "center center",
          toggleActions: "play reverse play reverse",
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [scrub, scaleFactor]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-gray-100"
    >
      <div
        ref={trackRef}
        className="flex h-full will-change-transform"
        style={{ width: `${panels.length * 100}vw` }}
      >
        {panels.map((panel, i) => (
          <div
            key={i}
            className="panel w-screen h-full flex-shrink-0 flex items-center justify-center transition-transform duration-300"
          >
            {panel}
          </div>
        ))}
      </div>
    </section>
  );
}
