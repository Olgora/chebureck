"use client";

import { useEffect, useRef } from "react";

export function useLockBodyScroll(locked: boolean) {
  const scrollY = useRef(0);

  useEffect(() => {
    if (!locked) return;

    scrollY.current = window.scrollY;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.paddingRight = "";

      // Возвращаем скролл туда, где он был до открытия модалки
      window.scrollTo(0, scrollY.current);
    };
  }, [locked]);
}