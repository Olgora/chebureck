 "use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/context/diccontext";
import { Product } from "@/types/index";
import styles from "./menupage.module.css"; // 🌟 Импорт CSS-модуля

interface TabCategory {
  id: string;
  name_pt: string;
  name_en: string | null;
  products: Product[];
}

export default function MenuTabs({ categories }: { categories: TabCategory[] }) {
  const { language } = useI18n();
  const [activeTab, setActiveTab] = useState<string>(categories[0]?.id || "");

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

  return (
    <div className={styles.container}>
      <div className={styles.scroller}>
        {categories.map((category) => {
          const isActive = activeTab === category.id;
          
          // Строгая типизация динамического ключа без any
          const nameKey = `name_${language}` as keyof Omit<TabCategory, 'id' | 'products'>;
          const displayName = category[nameKey] || category.name_pt;

          return (
            <button
              key={category.id}
              onClick={() => handleTabClick(category.id)}
              className={`${styles.tabButton} ${isActive ? styles.tabButtonActive : ""}`}
            >
              {displayName}
              
              {/* Линия рендерится только под активным пунктом */}
              {isActive && <span className={styles.underline} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}