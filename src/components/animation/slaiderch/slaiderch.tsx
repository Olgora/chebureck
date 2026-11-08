"use client"
import styles from "./slaiderch.module.css";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type Tprops = {
  slidesToShow: number;
  list: string[];
};

const SimpleCH = (props: Tprops) => {
  const list = props.list;
  const settings = {
    infinite: true,
    slidesToShow: props.slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    speed: 3000,
    autoplaySpeed: 2000,
    cssEase: "linear",
  };
  return (
    <div className={styles.main}>
      <Slider {...settings}>
        {list.map((item, index) => {
          return (
            <div key={index}>
              <Image src={item} alt={"alt"} width={300} height={300} />
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default SimpleCH;
