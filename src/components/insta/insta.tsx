"use client";

import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import styles from "./insta.module.css";
import HoverOverlayCard from "@/components/animation/boxincenter/boxincenter";
import { useI18n } from "@/context/diccontext";
import { motion } from "framer-motion";
import inst1 from "../../../public/sosimg01.png";
import inst2 from "../../../public/sosimg02.png";
import inst3 from "../../../public/sosimg03.png";
import inst4 from "../../../public/sosimg04.png";
import inst5 from "../../../public/sosimg05.png";
import inst6 from "../../../public/sosimg06.png";
import inst7 from "../../../public/sosimg07.png";
import Link from "next/link";
import IInstagram from "../iconsvg/iinsagram";

export default function Insta() {
  const { dictionary } = useI18n();
  const listmenu = [
    {
      image: inst1,
      text: dictionary.promo.img_01,
      rotate: -1.5,
      link: "https://www.instagram.com/reel/DZSnvbLiU4y/?igsh=dTNjc3h6dTc1cjVl",
    },
    {
      image: inst2,
      text: dictionary.promo.img_02,
      rotate: -1,
      link: "https://www.instagram.com/p/DOyKzRtDBfZ/?img_index=1&igsh=bHJ5eDhicXBpeHls",
    },
    {
      image: inst3,
      text: dictionary.promo.img_03,
      rotate: 1.2,
      link: "https://www.instagram.com/p/DZiteBbMZOs/?igsh=Y2E3YTdtazFrb3o0",
    },
    {
      image: inst4,
      text: dictionary.promo.img_04,
      rotate: -0.8,
      link: "https://www.instagram.com/p/DZ8Cf5FsyDR/?igsh=eTU0YzdkeHV3MG04",
    },
    {
      image: inst5,
      text: dictionary.promo.img_05,
      rotate: -1.1,
      link: "https://www.instagram.com/p/DOyKzRtDBfZ/?img_index=1&igsh=bHJ5eDhicXBpeHls",
    },
    {
      image: inst6,
      text: dictionary.promo.img_06,
      rotate: -0.5,
      link: "https://www.instagram.com/p/DZiteBbMZOs/?igsh=Y2E3YTdtazFrb3o0",
    },
    {
      image: inst7,
      text: dictionary.promo.img_07,
      rotate: 1,
      link: "https://www.instagram.com/p/DOyKzRtDBfZ/?img_index=1&igsh=bHJ5eDhicXBpeHls",
    },
  ];

  const settings = {
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    cssEase: "ease",
    centerMode: true,
    centerPadding: "0px",
    arrows: false,
    dots: false,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },

      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <main className={styles.main}>
      <h2 className="title">{dictionary.promo.sosial}</h2>
      <div className={styles.container}>
        <div className={styles.sliderWrapper}>
          <Slider {...settings}>
            {listmenu.map((src, i) => (
              <Link
                className={styles.slideritem}
                key={i}
                href={src.link}
                target="_blank"
              >
                <motion.div
                  className={styles.comicCard}
                  initial={{ rotate: src.rotate }}
                  whileHover={{
                    rotate: 0,
                    zIndex: 10,
                  }}
                  transition={{ type: "spring", stiffness: 250, damping: 15 }}
                >
                  <div className={styles.imageContainer}>
                    <HoverOverlayCard
                      key={i}
                      imageUrl={src.image.src}
                      title={src.text}
                      altText={src.text}
                    />
                  </div>
                  <div className={styles.name}>
                    <IInstagram
                      color="red"
                      size={60}
                      coloract=" #a7e0a2"
                    ></IInstagram>
                    <p>check.cheburek.pt</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </Slider>
        </div>
      </div>
    </main>
  );
}

/*return (
    <main className={styles.main}>
      <SliderTsx size={300} gap={20}>
        {listmenu.map((src, i) => (
          <div key={i}>
            <ProductCard key={src.id} product={src} />
          </div>
        ))}
      </SliderTsx>
    </main>
  );*/
