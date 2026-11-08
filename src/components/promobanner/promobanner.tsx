// src/components/promo-banner/PromoBanners.tsx
import { BannerService } from "@/services/promo/bannerservice";
import styles from "./promobanner.module.css";

interface PromoBannersProps {
  //language: "pt" | "en";
  language: string;
}

export default async function PromoBanners({ language }: PromoBannersProps) {
  // Получаем массив активных баннеров прямо с сервера
  const banners = await BannerService.getActiveBanners();

  if (banners.length === 0) return null; // Если акций нет, компонент не занимает место
  let lang: "pt" | "en";

  if (language === "pt") {
    lang = "pt";
  } else {
    lang = "en";
  }
  return (
    <div className={styles.bannerWrapper}>
      {banners.map((banner) => {
        const isProduct = banner.type === "product";

        return (
          <div
            key={banner.id}
            className={`${styles.banner} ${isProduct ? styles.bannerProduct : ""}`}
          >
            <h2 className={styles.title}>{banner[`title_${lang}`]}</h2>
            <p className={styles.subtitle}>{banner[`subtitle_${lang}`]}</p>
            <button className={styles.actionButton}>
              {banner[`buttonText_${lang}`]}
            </button>
          </div>
        );
      })}
    </div>
  );
}
