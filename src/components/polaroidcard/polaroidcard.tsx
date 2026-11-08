"use client";

import Image from "next/image";
import { useMemo, useRef } from "react";
import styles from "./polaroidcard.module.css";
import { formatPriceEUR } from "../utils/func";

type Props = {
  id: string;
  image: string;
  title: string;
  price: number;
  promo: string | null;
  promo_price: number;
  has_discount?: boolean;
};

function getRotate(seed: string) {
  let hash = 0;

  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  const values = [-5, -3, -2.5, 2.5, 3, 5];
  //const values = [-3, -2, -1.5, 1.5, 2, 3];

  return values[hash % values.length];
}

export default function MagnetCard({
  id,
  image,
  title,
  price,
  promo,
  promo_price,
  has_discount,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  // 🎯 полностью стабильное значение без state/effect
  const rotate = useMemo(() => getRotate(id), [id]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;

    const rotateX = deltaY * -6;
    const rotateY = deltaX * 6;

    el.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      rotate(${rotate}deg)
    `;
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;

    el.style.transform = `rotate(${rotate}deg)`;
  };

  return (
    <div
      ref={cardRef}
      className={styles.card}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className={styles.imageWrap}>
        <Image
          src={image}
          alt={title}
          fill
          sizes="50vw"
          className={styles.image}
        />
        {has_discount && <div className={styles.promoline}>{promo}</div>}
      </div>

      <div className={styles.meta}>
        <div className={styles.title}>{title}</div>
        {has_discount ? (
          < >
            <span className={styles.oldPrice}>{formatPriceEUR(price)}</span>
            <span className={styles.newPrice}>
              {formatPriceEUR(promo_price)}
            </span>
          </>
        ) : (
          <span className={styles.normalPrice}>
            {formatPriceEUR(price)}
          </span>
        )}
      </div>
    </div>
  );
}

/*<div
        className={styles.tape}
        style={{
          clipPath:
            "polygon(0% 20%, 3% 0%, 97% 5%, 100% 25%, 98% 85%, 95% 100%, 5% 95%, 0% 75%)",
        }}
      >
        
      </div>*/
