"use client";

import { useI18n } from "@/context/diccontext";
import styles from "./contactblock.module.css";
import chalkboardBg from "../../../public/empty-blackboard.png";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import IInstagram from "../iconsvg/iinsagram";
import { useEffect, useState } from "react";
import { HoverIcon } from "../animation/hovericon/hovericon";
import { HoverText } from "../animation/hovertext/hovertext";

export default function ContactsBlock() {
  const { dictionary, language } = useI18n();
  const week = [
    {
      name: dictionary.contactbox.day_0,
      close: dictionary.contactbox.day_0ho,
      open: dictionary.contactbox.day_0hc,
    },
    {
      name: dictionary.contactbox.day_1,
      close: dictionary.contactbox.day_1ho,
      open: dictionary.contactbox.day_1hc,
    },
    {
      name: dictionary.contactbox.day_2,
      close: dictionary.contactbox.day_2ho,
      open: dictionary.contactbox.day_2hc,
    },
    {
      name: dictionary.contactbox.day_3,
      close: dictionary.contactbox.day_3ho,
      open: dictionary.contactbox.day_3hc,
    },
    {
      name: dictionary.contactbox.day_4,
      close: dictionary.contactbox.day_4ho,
      open: dictionary.contactbox.day_4hc,
    },
    {
      name: dictionary.contactbox.day_5,
      close: dictionary.contactbox.day_5ho,
      open: dictionary.contactbox.day_5hc,
    },
    {
      name: dictionary.contactbox.day_6,
      close: dictionary.contactbox.day_6ho,
      open: dictionary.contactbox.day_6hc,
    },
  ];
  const [today, setToday] = useState<number>(0);
  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const day = now.getDay();
      setToday(day); // 0 - Воскресенье, 1 - Понедельник, 2 - Вторник...
    };

    checkOpenStatus();
    // Обновляем проверку каждые 30 секунд на случай, если пользователь застрял на странице в момент закрытия
    const interval = setInterval(checkOpenStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Текстовая информация из словаря */}
        <div className={styles.infoSide}>
          {/* Время работы */}

          <div className={styles.hoursList}>
            {week.map((day, index) => {
              // Проверяем, открыто ли вообще заведение в этот день
              const isOpen = day.open !== 0 && day.close !== 0;
              const todayd = index === today;
              return (
                <div key={index}>
                  {isOpen ? (
                    <div
                      className={`${styles.hoursItem} ${todayd ? styles.hoursItemT : ""}`}
                    >
                      <div>{day.name}:</div>
                      <div>{day.close}:00</div>
                      <div>-</div>
                      <div>{day.open}:00</div>
                    </div>
                  ) : (
                    /* Блок, если день ВЫХОДНОЙ (хотя бы одно значение равно 0) */
                    <div className={styles.close}>
                      <div>{day.name}:</div>
                      <div> {dictionary.contactbox.status_closed}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Интерактивная карта */}
        <div className={styles.imageWrapper}>
          <motion.div
            className={styles.comicCard}
            initial={{ rotate: 1.5 }}
            whileHover={{
              rotate: 0,
              zIndex: 10,
            }}
            transition={{ type: "spring", stiffness: 250, damping: 15 }}
          >
            <div className={styles.mapWrapper}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3002.7930183773924!2d-8.6878393!3d41.1826815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd246f6deb80eb4f%3A0x4ccf0e8d1fa2a18f!2sCheck%20Cheburek!5e0!3m2!1sru!2spt!4v1777310123269!5m2!1sru!2spt"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
              />
            </div>
            <div className={styles.block} style={{ color: "black" }}>
              <h3 className={styles.title}>
                {dictionary.contacts.locationTitle}
              </h3>
              <p className={`${styles.text} font-medium max-w-sm`}>
                {dictionary.contacts.address}
              </p>
            </div>
            <div>
              <Link
                className={styles.slideritem}
                href={
                  "https://www.instagram.com/check.cheburek.pt?igsh=dHdweHhtaXlodm5v"
                }
                target="_blank"
              >
                <IInstagram
                  color="red"
                  size={80}
                  coloract=" #a7e0a2"
                ></IInstagram>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Копирайт */}
      <div className={styles.bottomBar}>
        <p className={styles.link}>
          © {new Date().getFullYear()} {dictionary.contacts.copyright}
        </p>
        <p className={styles.link}>|</p>
        <Link className={styles.link} href="https://www.livroreclamacoes.pt">
          <Image
            className={styles.logo}
            src="/livro_reclamacoes1.png"
            alt="Livro Reclamacoes"
            width={150}
            height={44}
          />
        </Link>
        <p className={styles.link}>|</p>
        <Link href={`/${language}/politica`} className={styles.link}>
          {dictionary.end.politica}
        </Link>
        <p className={styles.link}>|</p>
        <Link href={`/${language}/condicoes`} className={styles.link}>
          {dictionary.end.condicoes}
        </Link>
        <p className={styles.link}>|</p>
        <HoverText textL={dictionary.end.ral_text} text="RAL"></HoverText>
      </div>
    </div>
  );
}
