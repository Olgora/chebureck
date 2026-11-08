"use client";

import React from "react";

interface RotateProps {
  children: React.ReactNode;
  angle: number; // Угол поворота в градусах (например: 5, -10, 180)
  shiftY:number
}

export const Rotate: React.FC<RotateProps> = ({ children, angle, shiftY }) => {
  return (
    <div
      style={{
        display: "inline-block", // Чтобы блок сжимался под размер контента
        transform: `rotate(${angle}deg) translateY(${shiftY}px)`,
        transformOrigin: "center center", // Точка, вокруг которой происходит поворот
        willChange: "transform", // Оптимизация для плавности сглаживания шрифтов
        
      }}
    >
      {children}
    </div>
  );
};
