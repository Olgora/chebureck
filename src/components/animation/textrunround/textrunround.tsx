"use client";

import Image from "next/image";
import styles from "./textrunround.module.css";
import { useResize } from "@/components/utils/hook"; // подставь свой реальный путь

type Props = {
  text: string;
  logoSrc?: string;
  /** Размер на десктопе (px) */
  size?: number;
  /** Размер на мобильном (px). Если не задан — считается автоматически от size */
  sizeMobile?: number;
  rotate?: boolean;
  colort: string;
  grad: number;
  /** Размер шрифта на десктопе, в единицах viewBox (не px экрана) */
  fontsize?: number;
  /** Размер шрифта на мобильном — задавай ОТДЕЛЬНО, не пропорционально size,
      иначе круговой текст станет нечитаемым при уменьшении круга. */
  fontsizeMobile?: number;
  /** Порог, ниже которого включается мобильная версия */
  mobileBreakpoint?: number;
};

const MOBILE_MIN_SIZE = 80; // ниже этого — круговой текст почти наверняка нечитаем

const TextRunRound = ({
  text,
  logoSrc,
  size = 200,
  sizeMobile,
  rotate = false,
  colort = "black",
  grad = 30,
  fontsize = 14,
  fontsizeMobile,
  mobileBreakpoint = 640,
}: Props) => {
  const { width } = useResize();
  const isMobile = width > 0 && width <= mobileBreakpoint;

  // Если явный мобильный размер не передали — берём разумный дефолт,
  // но никогда не даём уйти ниже порога читаемости/тач-зоны.
  const effectiveSize = isMobile
    ? Math.max(sizeMobile ?? Math.round(size * 0.55), MOBILE_MIN_SIZE)
    : size;

  // ВАЖНО: fontsize не масштабируется линейно вместе с size.
  // При уменьшении круга шрифт нужно относительно УВЕЛИЧИВАТЬ
  // (в единицах viewBox), чтобы компенсировать общее сжатие SVG.
  // Если fontsizeMobile не передан явно — считаем компенсацию автоматически:
  // сохраняем примерно тот же ВИЗУАЛЬНЫЙ размер текста в px экрана,
  // а не тот же размер в координатах viewBox.
  const autoFontsizeMobile = Math.round(fontsize * (size / effectiveSize));
  const effectiveFontsize = isMobile
    ? fontsizeMobile ?? autoFontsizeMobile
    : fontsize;

  return (
    <div
      className={styles.wrapper}
      style={{ width: effectiveSize, height: effectiveSize }}
    >
      {/* CIRCLE TEXT */}
      <svg
        viewBox="0 0 200 200"
        className={`${styles.svg} ${rotate ? styles.rotate : ""}`}
      >
        <defs>
          <path
            id="circlePath"
            d="
              M 100,100
              m -75,0
              a 75,75 0 1,1 150,0
              a 75,75 0 1,1 -150,0
            "
          />
        </defs>

        <text
          className={styles.circleText}
          style={{ fill: colort, fontSize: `${effectiveFontsize}px` }}
        >
          <textPath href="#circlePath">{text}</textPath>
        </text>
      </svg>

      {/* LOGO (STRETCHED) */}
      {logoSrc && (
        <div
          className={styles.logoBox}
          style={{ transform: `translate(-50%, -50%) rotate(${grad}deg)` }}
        >
          <Image src={logoSrc} alt="logo" fill className={styles.logo} />
        </div>
      )}
    </div>
  );
};

export default TextRunRound;