"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 🌟 Импортируем хук для определения текущего пути
import styles from "./navbar.module.css";
import { useI18n } from "@/context/diccontext";
import { LanguageDropdown } from "@/components/languageswitcher/languageswitcher";
import Buttonspring from "@/components/animation/buttonspring/buttonspring";

export default function Navbar() {
  const { language } = useI18n();
  const pathname = usePathname(); // 🌟 Получаем текущий URL (например, "/" или "/menu")

  const isHomePage = pathname === `/${language}`;

  return (
    /* 🌟 Меняем класс в зависимости от страницы. 
       Для главной добавляем styles.fixed, чтобы навбар не исчезал */
    <nav className={styles.main}>
      {/* 🌟 ВАРИАНТ ДЛЯ ГЛАВНОЙ СТРАНИЦЫ */}
      {isHomePage ? (
        <div className={styles.menu}>
          <Link href={`/${language}/menu`}>MENU</Link>
        </div>
      ) : (
        /* 🌟 ВАРИАНТ ДЛЯ СТРАНИЦЫ МЕНЮ (Обычный чистый логотип) */
        <Link href={`/${language}`} className={styles.logobox}>
          <Buttonspring
            icon={
              <Image
                className={styles.logo}
                src="/logo.png"
                alt="logo"
                width={60}
                height={60}
                priority
              />
            }
          ></Buttonspring>
        </Link>
      )}

      <div className={styles.lang}>
        <LanguageDropdown />
      </div>
    </nav>
  );
}
