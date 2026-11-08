"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = {
  leftImage: string;
  rightImage: string;
  initialPercent?: number; // 0..100
};

export default function ImageCurtainClipDragWithLabels({
  leftImage,
  rightImage,
  initialPercent = 50,
}: Props) {
  const contRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLDivElement | null>(null);

  const [overlayPercent, setOverlayPercent] = useState<number>(() =>
    Math.min(Math.max(initialPercent, 0), 100)
  );

  // ref-флаг и rAF id для плавного обновления
  const isDraggingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const pendingXRef = useRef<number | null>(null);

  // вычисляет проценты и обновляет состояние (в rAF)
  const flushPosition = () => {
    const container = contRef.current;
    const clientX = pendingXRef.current;
    if (container && typeof clientX === "number") {
      const rect = container.getBoundingClientRect();
      const raw = ((clientX - rect.left) / rect.width) * 100;
      const percent = Math.min(Math.max(raw, 0), 100);
      setOverlayPercent(percent);
      pendingXRef.current = null;
    }
    rafRef.current = null;
  };

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      // запомним clientX и запланируем rAF
      pendingXRef.current = e.clientX;
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(flushPosition);
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        // снимем захват, если был
        try {
          // release pointer capture если возможно
          const handle = handleRef.current;
          if (handle && (e.pointerId !== undefined) && (handle.releasePointerCapture as any)) {
            // без try/catch иногда в старых браузерах бросает
            handle.releasePointerCapture(e.pointerId);
          }
        } catch (err) {
          /* ignore */
        }
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  // pointerdown на ручке — включаем drag и захватываем указатель
  const onHandlePointerDown = (e: React.PointerEvent) => {
    // только левая кнопка для мыши
    if (e.pointerType === "mouse" && e.button !== 0) return;

    isDraggingRef.current = true;
    // захватим указатель на элементе ручки, чтобы получать pointermove даже когда курсор выходит за пределы
    try {
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    } catch (err) {
      /* ignore */
    }
    pendingXRef.current = e.clientX;
    if (rafRef.current == null) rafRef.current = requestAnimationFrame(flushPosition);
  };

  // нажатие непосредственно по контейнеру — тоже начинаем перетаскивание (опционально)
  const onContainerPointerDown = (e: React.PointerEvent) => {
    // если кликнули НЕ по ручке, всё равно можно начать перетаскивать:
    // определим, если target === container, начнём drag
    if (e.target === contRef.current) {
      isDraggingRef.current = true;
      try {
        (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      } catch (err) {}
      pendingXRef.current = e.clientX;
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(flushPosition);
    }
  };

  // стилевые значения для clipPath и позиции ручки
  const clipValue = `inset(0 ${100 - overlayPercent}% 0 0)`;
  const handleLeft = `${overlayPercent}%`;

  return (
    <div
      ref={contRef}
      className="relative w-full h-screen overflow-hidden select-none touch-none"
      style={{ touchAction: "none" }}
      onPointerDown={onContainerPointerDown}
    >
      {/* Нижняя картинка (правее) */}
      <img
        src={rightImage}
        alt="Right"
        className="absolute top-0 left-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Верхняя картинка (левее) */}
      <img
        src={leftImage}
        alt="Left"
        className="absolute top-0 left-0 w-full h-full object-cover"
        draggable={false}
        style={{
          clipPath: clipValue,
        }}
      />

      {/* Вертикальная линия / ручка */}
      <div
        ref={handleRef}
        className="absolute top-0 bottom-0 z-20 cursor-ew-resize"
        style={{
          left: handleLeft,
          width: 3,
          transform: "translateX(-50%)",
          background: "rgba(255,255,255,0.95)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPointerDown={onHandlePointerDown}
      >
        <div
          style={{
            transform: "translateY(-50%)",
            position: "absolute",
            top: "50%",
            left: "50%",
            transformOrigin: "center",
            translate: "-50% -50%",
          }}
        />
        {/* кружок-ручка */}
        <div
          style={{
            background: "white",
            borderRadius: "999px",
            padding: 8,
            border: "2px black solid",
            
            position: "relative",
            left: "50%",
          }}
        >
          <div style={{ width: 8, height: 8, background: "#222", borderRadius: 4 }} />
        </div>
      </div>
    </div>
  );
}
