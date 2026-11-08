"use client";

import React, { useId } from "react";
import styles from "./textrunround.module.css";

type Tprops = {
  name: string;
   
  radius?: number; // 🔥 радиус круга
  size?: number;   // 🔥 размер блока (ширина & высота)
  fontSize?: number;
  children: React.ReactNode;
};

export default function TextRunRound({
  name,
  
  radius = 75, // ✔ значение по умолчанию
  size = 200,
  fontSize=10,

  children
}: Tprops) {
  const uid = useId();
  const pathId = `circlePath-${uid.replace(/:/g, "-")}`;

  // Центр круга всегда в середине SVG
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div
      className={styles.container}
      style={{ width: size, height: size }} // динамический размер
    >
      <div className={styles.wrapper}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className={styles.svg}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <path
              id={pathId}
              d={`
                M ${cx},${cy}
                m -${radius},0
                a ${radius},${radius} 0 1,1 ${radius * 2},0
                a ${radius},${radius} 0 1,1 -${radius * 2},0
              `}
            />
          </defs>

          <text className={styles.circleText} style={{ fontSize:`${fontSize}px` }}>
            <textPath
              href={`#${pathId}`}
              xlinkHref={`#${pathId}`}
              startOffset="50%"
              textAnchor="middle"
            >
              {name}   ★  {name}  ★
            </textPath>
          </text>
        </svg>
      </div>

      <div className={styles.cent}>{children}</div>
    </div>
  );
}
