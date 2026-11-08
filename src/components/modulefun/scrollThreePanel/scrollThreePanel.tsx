"use client";

import { ReactNode, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
};

export default function ScrollThreePanel({ left, center, right }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const centerEl = centerRef.current;
    if (!container || !centerEl) return;

    ScrollTrigger.refresh();

    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: false,
      pin: centerEl,      // фиксирует центральный блок
      pinSpacing: false,  // не создаёт пустого пространства
    });

    return () => ScrollTrigger.killAll();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "start",
        position: "relative",
        minHeight: "200vh", // нужно чтобы работал скролл
      }}
    >
      {/* Левая колонка — просто скроллится */}
      <div style={{ padding: "40px" }}>{left}</div>

      {/* Центральная колонка — фиксируется */}
      <div
        ref={centerRef}
        style={{
          position: "relative",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none", // чтобы не мешала кликам, можно убрать
        }}
      >
        <div style={{ pointerEvents: "auto" }}>{center}</div>
      </div>

      {/* Правая колонка — просто скроллится */}
      <div style={{ padding: "40px" }}>{right}</div>
    </div>
  );
}
