"use client";

import styles from "./slidertsx.module.css";
import { useResize } from "../../utils/hook";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type Tprops = {
  size: number;
  children: React.ReactNode;
  gap: number;
};

export const SliderTsx = ({ children, size, gap }: Tprops) => {
  const wl = useResize().width;

  // wl === 0 значит "ещё не измерено" — до первого измерения используем
  // безопасный дефолт (1), чтобы не пытаться делить на неизвестную ширину.
  const containerWidth = wl > 0 ? wl * 0.9 : 0; // .stringtext занимает 83vw, а не всю ширину окна

  const MAX_COLUMNS = 4;

  const col =
    containerWidth > 0
      ? Math.min(
          MAX_COLUMNS,
          Math.max(1, Math.floor((containerWidth + gap) / (size + gap))),
        )
      : 1;

  const settings = {
    infinite: true,
    slidesToShow: col,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 2000,
    cssEase: "linear",
    swipeToSlide: true,
    dots: true,
    arrows: false,
  };

  return (
    <div className={styles.main}>
      <div className={styles.stringtext} style={{ width: "93vw" }}>
        {/* key меняется только когда меняется САМО количество слайдов,
            а не на каждый пиксель ресайза — react-slick не перестраивает
            раскладку по живому изменению slidesToShow без ремонта,
            поэтому пересоздаём компонент именно в момент смены col */}
        <Slider key={col} {...settings}>
          {children}
        </Slider>
      </div>
    </div>
  );
};

export default SliderTsx;
