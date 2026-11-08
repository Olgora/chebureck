"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import styles from "./incenter.module.css";

interface FadeInUpProps {
  children: ReactNode;
  className?: string;
}

export default function FadeInCenter({ children, className = "" }: FadeInUpProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Проверяем, что мы в браузере и IntersectionObserver доступен
    if (typeof window === "undefined" || !window.IntersectionObserver) return;

    const observer = new window.IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -150px 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.hidden} ${isIntersecting ? styles.visible : ""} ${className}`}
    >
      {children}
    </div>
  );
}