"use client";

import { useEffect, useMemo, useState } from "react";
import { ReviewModal } from "@/components/reviewsmodal/reviewmodal";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import styles from "./reviewssection.module.css";

import { useI18n } from "@/context/diccontext";
import { FancyButtonXL } from "@/components/animation/hoverbuttonxl/hoverbuttonxl";
import { Review } from "@/types/index";
import { Product } from "@/types/index";

import ProductCardSmall from "@/components/productcardsmall/productcardsmall";

type Props = {
  reviews: Review[];
  listprod: Product[];
};

export default function ReviewsSection({ reviews, listprod }: Props) {
  const [open, setOpen] = useState(false);

  const { dictionary } = useI18n();

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;

    return (
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    ).toFixed(1);
  }, [reviews]);

  // react-slick's `responsive` breakpoints only react to a resize event after
  // mount (they use matchMedia.addListener, which never fires for the width
  // the page already loaded at) — on a phone that never gets resized, the
  // desktop slidesToShow stays active. Track the viewport ourselves instead.
  const [slidesToShow, setSlidesToShow] = useState(3);

  useEffect(() => {
    const updateSlidesToShow = () => {
      const width = window.innerWidth;
      if (width < 800) setSlidesToShow(1);
      else if (width < 1024) setSlidesToShow(2);
      else setSlidesToShow(3);
    };

    updateSlidesToShow();
    window.addEventListener("resize", updateSlidesToShow);
    return () => window.removeEventListener("resize", updateSlidesToShow);
  }, []);

  const settings = {
    infinite: reviews.length > slidesToShow,
    speed: 600,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    cssEase: "ease",
    centerMode: slidesToShow > 1,
    centerPadding: "0px",
    arrows: false,
    dots: true,
  };

  const item = (ind: number): Product => {
    return listprod[ind % listprod.length];
  };

  return (
    <section className={styles.main}>
      <div className={styles.container}>
        {/* HEADER */}
        <div className={styles.header}>
          <div>
           
            <h2 className="title">{dictionary.reviews.people_love_food}</h2>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.ratingBox}>
              <div className={styles.ratingNumber}>{avgRating}</div>
              <div className={styles.ratingContent}>
                <div className={styles.stars}>★★★★★</div>

                <p className={styles.ratingText}>
                  {dictionary.reviews.based_on} {reviews.length}{" "}
                  {dictionary.reviews.reviews}
                </p>
                <FancyButtonXL
                  baseColor="rgba(10, 10, 10, 0)"
                  hoverColor="white"
                  wsize="200px"
                  hsize="60px"
                  onClick={() => setOpen(true)}
                  name={dictionary.reviews.leave_review}
                  borderradius="0px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ReviewModal isOpen={open} onClose={() => setOpen(false)} />

      {reviews.length > 0 && (
        <div className={styles.sliderWrapper}>
          <Slider {...settings}>
            {reviews.map((review, index) => (
              <div key={review.id} className={styles.slide}>
                <div className={styles.card} style={{ minHeight: "500px" }}>
                  <div className={styles.cardbox}>
                    {/* top */}
                    <div className={styles.cardTop}>
                      <div className={styles.reviewStars}>
                        {"★".repeat(review.rating)}
                      </div>
                    </div>

                    {/* comment */}
                    {review.comment && (
                      <p className={styles.comment}>“{review.comment}”</p>
                    )}
                    <div className={styles.userInfo}>
                      <div>
                        <h3 className={styles.userName}>
                          {review.name ?? "Guest"}
                        </h3>

                        <p className={styles.date}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {review.isVerified && (
                      <div className={styles.verified}>
                        {dictionary.reviews.verified}
                      </div>
                    )}
                  </div>
                  
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </section>
  );
}
 