"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/context/diccontext";
import FadeInUp from "@/components/animation/inupp/inupp"; // Твой анимационный блок!
import styles from "./contacrt.module.css";
import locationImg from "../../../public/location.webp";
import HoverOverlayCard from "@/components/animation/boxincenter/boxincenter";
import { motion } from "framer-motion";
import IPin from "../iconsvg/ipin";
import IconSpringButton from "../animation/iconspring/iconspring";

export default function ContactsBlockNew() {
  const { dictionary } = useI18n();
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [today, setToday] = useState<number>(0);
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

  const googleMapsUrl = dictionary.contactbox.map;

  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const day = now.getDay();
      setToday(day); // 0 - Воскресенье, 1 - Понедельник, 2 - Вторник...
      const hour = now.getHours();
      const minute = now.getMinutes();
      const currentTime = hour + minute / 60; // Переводим время в удобный формат (например, 20.1)
      // Собираем строки ключей

      const openKey = `day_${day}ho` as keyof typeof dictionary.contactbox;
      const closeKey = `day_${day}hc` as keyof typeof dictionary.contactbox;

      const openTime = dictionary.contactbox[openKey] as number;
      const closeTime = dictionary.contactbox[closeKey] as number;

      if (day === dictionary.contactbox.closed) {
        setIsOpen(false);
        return;
      } else {
        setIsOpen(currentTime >= openTime && currentTime < closeTime);
        return;
      }
    };

    checkOpenStatus();
    // Обновляем проверку каждые 30 секунд на случай, если пользователь застрял на странице в момент закрытия
    const interval = setInterval(checkOpenStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    // 🌟 Оборачиваем весь блок в твой кастомный эффект разворота из центра

    <FadeInUp>
      <section className={styles.main}>
        <div className={styles.grid}>
          {/* ПРАВАЯ ЧАСТЬ: Контакты и интерактивный статус */}
          <div className={styles.info}>
            <h2 className="title">{dictionary.contactbox.title}</h2>
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
                        {day.name}: {dictionary.contactbox.status_closed}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {isOpen !== null && (
              <div
                className={`${styles.statusBadge} ${isOpen ? styles.open : styles.closed}`}
              >
                <span className={styles.dot}></span>
                {isOpen
                  ? dictionary.contactbox.status_open
                  : dictionary.contactbox.status_closed}
              </div>
            )}
          </div>
          {/* ЛЕВАЯ ЧАСТЬ: Фото места */}

          <motion.div
            className={styles.comicCard}
            initial={{ rotate: -1.5 }}
            whileHover={{
              rotate: 0,
              zIndex: 10,
            }}
            transition={{ type: "spring", stiffness: 250, damping: 15 }}
          >
            <div className={styles.imageContainer}>
              <HoverOverlayCard
                key={1}
                imageUrl={locationImg.src}
                title={dictionary.contactbox.espera}
                altText={dictionary.contactbox.espera}
              />
            </div>
            <div className={styles.adress}>
              <IconSpringButton
                icon={
                  <Link
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IPin color="#a7e0a2" size={50} coloract="orange"></IPin>
                  </Link>
                }
                size={80}
              ></IconSpringButton>

              <p className={styles.subtitle}>{dictionary.contacts.address}</p>
            </div>
          </motion.div>
        </div>
      </section>
    </FadeInUp>
  );
}
