"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type Tlist = {
  sentens: string[]
}

export default function HoverFallingText({ sentens }: Tlist) {
  const containerRef = useRef<HTMLDivElement | null>(null);



  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const text = container.textContent || "";
    container.textContent = "";

    // Создаём span для каждой буквы
    const letters = text.split("").map((char) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.display = "inline-block";
      span.style.opacity = "1";
      container.appendChild(span);
      return span;
    });

    // Функция анимации при наведении
    const animateLetters = () => {
      const tl = gsap.timeline();

      // 1️⃣ Все исчезают одновременно
      tl.to(letters, {
        opacity: 0,
        duration: 0,
        ease: "power1.in",
      });

      // 2️⃣ Падают сверху по одной, в случайном порядке
      const shuffled = gsap.utils.shuffle([...letters]);
      tl.fromTo(
        shuffled,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: "bounce.out", stagger: 0.05 }
      );
    };

    container.addEventListener("mouseenter", animateLetters);

    // Очистка события при размонтировании
    return () => {
      container.removeEventListener("mouseenter", animateLetters);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="text-3xl font-bold text-gray-800 text-center mt-20 cursor-pointer"
    >
      {sentens}
    </div>
  );
}
