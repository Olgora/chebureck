"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/context/diccontext";
import { Product } from "@/types/index";
import styles from "./menupage.module.css";

interface TabCategory {
  id: string;
  name_pt: string;
  name_en: string | null;
  products: Product[];
}

export default function MenuTabs({ categories }: { categories: TabCategory[] }) {
  const { language } = useI18n();
  const [activeTab, setActiveTab] = useState<string>(categories[0]?.id || "");

  const scrollerRef = useRef<HTMLDivElement>(null);
  // Реф на каждую кнопку таба, по id категории
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(`category-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const observers = categories.map((category) => {
      const el = document.getElementById(`category-${category.id}`);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveTab(category.id);
          }
        },
        { rootMargin: "-120px 0px -70% 0px" }
      );

      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => obs?.observer.unobserve(obs.el));
    };
  }, [categories]);

  // Как только activeTab меняется (клик ИЛИ автоматически при скролле страницы) —
  // подскроллиdiv .scroller горизонтально так, чтобы активный таб был виден и по центру.
  useEffect(() => {
    const activeButton = tabRefs.current[activeTab];
    const scroller = scrollerRef.current;
    if (!activeButton || !scroller) return;

    const buttonRect = activeButton.getBoundingClientRect();
    const scrollerRect = scroller.getBoundingClientRect();

    // Насколько кнопка выступает за левый/правый край видимой области скроллера
    const overflowLeft = buttonRect.left - scrollerRect.left;
    const overflowRight = buttonRect.right - scrollerRect.right;

    // Если кнопка уже полностью видна — ничего не трогаем,
    // чтобы не дёргать скролл на каждый чих
    if (overflowLeft >= 0 && overflowRight <= 0) return;

    const targetScrollLeft =
      scroller.scrollLeft +
      (buttonRect.left + buttonRect.width / 2) -
      (scrollerRect.left + scrollerRect.width / 2);

    scroller.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
  }, [activeTab]);

  return (
    <div className={styles.container}>
      <div className={styles.scroller} ref={scrollerRef}>
        {categories.map((category) => {
          const isActive = activeTab === category.id;
          const nameKey = `name_${language}` as keyof Omit<TabCategory, "id" | "products">;
          const displayName = category[nameKey] || category.name_pt;

          return (
            <button
              key={category.id}
              ref={(el) => {
                tabRefs.current[category.id] = el;
              }}
              onClick={() => handleTabClick(category.id)}
              className={`${styles.tabButton} ${isActive ? styles.tabButtonActive : ""}`}
            >
              {displayName}

              {isActive && (
                <motion.span
                  layoutId="tab-underline"
                  className={styles.underline}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}