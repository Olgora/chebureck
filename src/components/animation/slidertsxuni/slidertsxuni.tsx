"use client";

import styles from "./slidertsx.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type Tprops = {
  children: React.ReactNode;

  col: number;
};

export const SliderTsx = ({ children, col }: Tprops) => {
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
    centerMode: true,
    centerPadding: "0px",
    focusOnSelect: true,
  };

  return (
    <div className={styles.main}>
      <div className={styles.stringtext}>
        <Slider {...settings}>{children}</Slider>
      </div>
    </div>
  );
};

export default SliderTsx;
