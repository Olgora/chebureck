"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/context/diccontext";
import styles from "./typewriter.module.css";
import Image from "next/image";
import Buttonspring from "@/components/animation/buttonspring/buttonspring";
import stepImg1 from "../../../public/instructions/step1.png";
import stepImg2 from "../../../public/instructions/step2.png";
import stepImg3 from "../../../public/instructions/step3.png";
import stepImg4 from "../../../public/instructions/step4.png";
import stepImg5 from "../../../public/instructions/step5.png";

function Typewriter({ text }: { text: string }) {
  const letters = Array.from(text);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.015 } },
  };

  const letterVariants = {
    hidden: { opacity: 0, display: "none" },
    visible: { opacity: 1, display: "inline" },
  };

  return (
    <motion.span
      key={text}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {letters.map((char, index) => (
        <motion.span key={index} variants={letterVariants}>
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function InstructionsBlock() {
  const { dictionary } = useI18n();
  const dict = dictionary.instructions;

  const [currentIndex, setCurrentIndex] = useState(0);

  const steps = [
    { id: 1, img: stepImg1 },
    { id: 2, img: stepImg2 },
    { id: 3, img: stepImg3 },
    { id: 4, img: stepImg4 },
    { id: 5, img: stepImg5 },
  ];

  const currentStep = steps[currentIndex];
  const titleKey = `step${currentStep.id}_title` as keyof typeof dict;
  const textKey = `step${currentStep.id}_text` as keyof typeof dict;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.titleBox}>
          <h2 className="title">{dict.mainTitle}</h2>
        </div>
        <div className={styles.box}>
          <div className={styles.buttonList}>
            {steps.map((step, index) => (
              <Buttonspring
                key={step.id}
                onClick={() => setCurrentIndex(index)}
                icon={
                  <div
                    className={`${styles.stepButton} ${
                      currentIndex === index ? styles.stepButtonActive : ""
                    }`}
                  >
                    {step.id}
                  </div>
                }
              ></Buttonspring>
            ))}
          </div>

          {/* КОЛОНКА 3: Наша сочная интерактивная карточка */}
          <motion.div
            className={styles.sliderCard}
            initial={{ rotate: 2 }}
            whileHover={{
              rotate: 0,
              scale: 1.03,
              zIndex: 10,
            }}
            transition={{ type: "spring", stiffness: 250, damping: 15 }}
          >
            <div className={styles.imageBox}>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentIndex}
                  className={styles.imageSlide} /* новый класс */
                  initial={{ opacity: 0, scale: 0.75, x: -100 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.75, x: 100 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Image
                    src={currentStep.img}
                    alt="Instruction pdf step"
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <h3 className={styles.cardTitle}>{dict?.[titleKey]}</h3>

            <div className={styles.textContainer}>
              <p className={styles.cardText}>
                {dict?.[textKey] ? <Typewriter text={dict[textKey]} /> : ""}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
