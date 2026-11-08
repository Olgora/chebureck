"use client";

import Image from "next/image";
import styles from "./floatimage.module.css";
import type { StaticImageData } from "next/image";

interface FloatingCheburekBgProps {
  image: StaticImageData | string;
  count?: number;
}

// Референсная ширина экрана, под которую "на глаз" подбирались px-размеры.
const REF_WIDTH = 1600;

// Превращает дизайнерский px-размер в адаптивный clamp:
// не меньше min, не больше designPx, между ними — доля от ширины экрана.
function respSize(designPx: number, min = 140) {
  const vw = (designPx / REF_WIDTH) * 100;
  return `clamp(${min}px, ${vw.toFixed(2)}vw, ${designPx}px)`;
}

const PIECES = [
  { top: "65vh", left: "-10vw", size: respSize(600, 160), duration: 6, delay: 0, opacity: 0.56, rotate: 38 },
  { top: "75vh", left: "75vw", size: respSize(540, 140), duration: 5, delay: 0.6, opacity: 0.64, rotate: -18 },
  { top: "190vh", left: "25vw", size: respSize(800, 160), duration: 8, delay: 0.3, opacity:1, rotate: -18 },
  
  { top: "40%", left: "2%", size: respSize(630, 140), duration: 9, delay: 0.6, opacity: 0.51, rotate: 28 },
  { top: "53%", left: "60%", size: respSize(630, 140), duration: 7, delay: 0.3, opacity: 0.51, rotate: -8 },
  { top: "62%", left: "-2%", size: respSize(630, 140), duration: 6, delay: 0.3, opacity: 0.51, rotate: 38 },
  { top: "67%", left: "65%", size: respSize(560, 130), duration: 8, delay: 1.2, opacity: 0.52, rotate: 2 },
  { top: "74%", left: "6%", size: respSize(770, 150), duration: 8, delay: 2, opacity: 0.53, rotate: -2 },
  { top: "84%", left: "75%", size: respSize(555, 130), duration: 9.5, delay: 1.6, opacity: 0.75, rotate: 10 },
  { top: "94%", left: "5%", size: respSize(655, 140), duration: 6, delay: 1.6, opacity: 0.75, rotate: 38 },
];

export default function FloatingCheburekBg({
  image,
  count = 4,
}: FloatingCheburekBgProps) {
  const pieces = PIECES.slice(0, count);

  return (
    <div className={styles.wrap} aria-hidden="true">
      {pieces.map((p, i) => (
        <div
          key={i}
          className={styles.piece}
          style={
            {
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              "--duration": `${p.duration}s`,
              "--delay": `${p.delay}s`,
              "--base-rotate": `${p.rotate}deg`,
              "--rotate-dir": i % 2 === 0 ? 1 : -1,
            } as React.CSSProperties
          }
        >
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 640px) 220px, (max-width: 1200px) 400px, 630px"
            className={styles.image}
          />
        </div>
      ))}
    </div>
  );
}