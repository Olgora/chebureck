'use client';

import { CSSProperties, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import styles from './stickycartmotion.module.css';

interface StickyCartProps {
  footerId?: string;
  topOffset?: number; // Отступ от верха экрана (px)
  bottomGap?: number; // Зазор между корзиной и футером (px)
  children: React.ReactNode;
}

export default function StickyCartMotion({
  footerId = 'site-footer',
  topOffset = 80,
  bottomGap = 24,
  children,
}: StickyCartProps) {
  const cartRef = useRef<HTMLDivElement>(null);

  // Сырое значение смещения
  const rawY = useMotionValue(0);

  // Сглаженное значение через пружину
  const smoothY = useSpring(rawY, {
    stiffness: 400,
    damping: 35,
    mass: 0.2,
  });

  useEffect(() => {
    const footer = document.getElementById(footerId);
    if (!footer || !cartRef.current) return;

    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        if (!cartRef.current || !footer) {
          rafId = null;
          return;
        }

        const footerRect = footer.getBoundingClientRect();
        const cartHeight = cartRef.current.offsetHeight;
        const cartBottom = topOffset + cartHeight + bottomGap;

        if (footerRect.top < cartBottom) {
          const pushDistance = cartBottom - footerRect.top;
          rawY.set(-pushDistance);
        } else {
          rawY.set(0);
        }

        rafId = null;
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.addEventListener('scroll', handleScroll, { passive: true });
          handleScroll();
        } else {
          window.removeEventListener('scroll', handleScroll);
          rawY.set(0);
        }
      },
      {
        root: null,
        rootMargin: '0px 0px 200px 0px',
        threshold: 0,
      }
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [footerId, topOffset, bottomGap, rawY]);

 return (
  <motion.aside
    ref={cartRef}
    className={styles.stickyCart}
    style={{
      y: smoothY,
      top: topOffset, // Framer Motion принимает просто число (px) или строку
    }}
  >
    {children}
  </motion.aside>
);
}