"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

type Props = {
  anchorRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
};

export default function PopupObject({ anchorRef, children }: Props) {
  const popupRef = useRef<HTMLDivElement | null>(null);

  const [visible, setVisible] = useState(false);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  // --- Управление видимостью ---
  useEffect(() => {
    const anchor = anchorRef.current;
    const popup = popupRef.current;
    if (!anchor || !popup) return;

    const show = () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
        hideTimeout.current = null;
      }
      setVisible(true);
    };

    const hide = () => {
      hideTimeout.current = setTimeout(() => setVisible(false), 80);
    };

    anchor.addEventListener("mouseenter", show);
    anchor.addEventListener("mouseleave", hide);
    /*popup.addEventListener("mouseenter", show);
    popup.addEventListener("mouseleave", hide);*/

    return () => {
      anchor.removeEventListener("mouseenter", show);
      anchor.removeEventListener("mouseleave", hide);
      popup.removeEventListener("mouseenter", show);
      popup.removeEventListener("mouseleave", hide);
    };
  }, []);

  // позиционирование и анимации
  useEffect(() => {
    if (!popupRef.current || !anchorRef.current) return;

    const popup = popupRef.current;
    const rect = anchorRef.current.getBoundingClientRect();

    popup.style.left = rect.left + rect.width / 2 + "px";
    popup.style.top = rect.top + rect.height / 2 + "px";

    if (visible) {
      gsap.fromTo(
        popup,
        { scale: 0, opacity: 0, rotate: -25 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        }
      );
    } else {
      gsap.to(popup, {
        scale: 0,
        opacity: 0,
        rotate: -15,
        duration: 0.8,
        ease: "back.in(1.7)",
      });
    }
  }, [visible]);

  return (
    <div
      ref={popupRef}
      className="fixed pointer-events-auto"
      style={{
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
}
