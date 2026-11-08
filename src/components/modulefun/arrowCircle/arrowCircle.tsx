"use client";

import { useState } from "react";

type Props = {
  size?: number;      // размер кружка в px
  color?: string;     // цвет кружка
  colorarrow?: string;     // цвет стрелки
};

export default function ArrowCircle({ size = 40, color = "#1E40AF", colorarrow = "white" }: Props) {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        margin:0,
        padding:0
      }}
      className="rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 "
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <svg
        width={size * 0.5}
        height={size * 0.5}
        viewBox="0 0 24 24"
        className="transition-transform duration-300"
        style={{
          transform: hover ? "rotate(-45deg)" : "rotate(0deg)",
        }}
      >
        <path
          d="M5 12h14M13 6l6 6-6 6"
          stroke={colorarrow}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
