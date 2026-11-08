"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/context/diccontext";
import styles from "./saborblock.module.css";
import Image from "next/image";
import fon from "../../../public/checkfon_01.png";
import frame1 from "../../../public/comic-frame1.png";
import frame2 from "../../../public/comic-frame2.png";
import frame3 from "../../../public/comic-frame3.png";
import frame4 from "../../../public/comic-frame4.png";
import FadeInCenter from "../animation/incenter/incenter";
import HoverOverlayCard from "../animation/boxincenter/boxincenter";

export default function WhyUsBlock() {
  const { dictionary } = useI18n();
  const dict = dictionary?.whyUs;

  const comicFrames = [
    { id: 1, img: frame1, rotate: -1.5 },
    { id: 2, img: frame2, rotate: 1 },
    { id: 3, img: frame3, rotate: -1 },
    { id: 4, img: frame4, rotate: 1.8 },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* ЯЧЕЙКА 1: Заголовок, который встает в общий ряд */}
        <div className={styles.titleBox}>
          <h2 className="title" style={{ textAlign: "start" }}>
            {dict.title}
          </h2>
        </div>

        {/* ЯЧЕЙКИ С 2 ПО 5: Твои 4 карточки-полароида */}
        {comicFrames.map((frame) => (
          <motion.div
            key={frame.id}
            className={styles.comicCard}
            initial={{ rotate: frame.rotate }}
            whileHover={{
              rotate: 0,
              scale: 1.03,
              zIndex: 10,
            }}
            transition={{ type: "spring", stiffness: 250, damping: 15 }}
          >
            <FadeInCenter>
              <div className={styles.imageContainer}>
                <HoverOverlayCard
                  key={1}
                  imageUrl={frame.img.src}
                  title={dict?.[`reason${frame.id}_title` as keyof typeof dict]}
                  altText={
                    dict?.[`reason${frame.id}_title` as keyof typeof dict]
                  }
                />
              </div>
            </FadeInCenter>

            <h3 className={styles.cardTitle}>
              {dict?.[`reason${frame.id}_title` as keyof typeof dict]}
            </h3>
            <p className={styles.cardText}>
              {dict?.[`reason${frame.id}_text` as keyof typeof dict]}
            </p>
          </motion.div>
        ))}
      </div>
      
    </section>
  );
}
