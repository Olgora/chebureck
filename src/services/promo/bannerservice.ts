// src/services/BannerService.ts
import { prisma } from "@/lib/prisma";

export interface BannerData {
  id: string;
  type: "weekly" | "product";
  title_pt: string;
  title_en: string;
  subtitle_pt: string;
  subtitle_en: string;
  buttonText_pt: string;
  buttonText_en: string;
}

export class BannerService {
  static async getActiveBanners(): Promise<BannerData[]> {
    const currentDay = new Date().getDay();
    const banners: BannerData[] = [];

    // 1. Проверяем, есть ли акция на СЕГОДНЯШНИЙ день недели
    const activeWeekly = await prisma.weeklyPromo.findFirst({
      where: { dayOfWeek: currentDay, isActive: true }
    });

    if (activeWeekly) {
      banners.push({
        id: `weekly-${activeWeekly.id}`,
        type: "weekly",
        title_pt: "PROMOÇÃO DE HOJE!",
        title_en: "TODAY'S PROMO!",
        subtitle_pt: `Todos os chebureks por apenas ${Number(activeWeekly.promoPrice).toFixed(2)}€! Aproveita já!`,
        subtitle_en: `All chebureks for only ${Number(activeWeekly.promoPrice).toFixed(2)}€! Enjoy now!`,
        buttonText_pt: "Pedir Agora",
        buttonText_en: "Order Now"
      });
    }

    // 2. Проверяем, есть ли активный "Товар недели" (Product Promo)
    const activeProductPromo = await prisma.productPromo.findFirst({
      where: { isActive: true },
      include: { product: true }
    });

    if (activeProductPromo && activeProductPromo.product) {
      const p = activeProductPromo.product;
      const isPercent = activeProductPromo.type === "PERCENT";
      const promoValue = Number(activeProductPromo.value);
      
      const details_pt = isPercent ? `-${promoValue}% de desconto!` : `Preço especial: ${promoValue.toFixed(2)}€!`;
      const details_en = isPercent ? `-${promoValue}% off!` : `Special price: ${promoValue.toFixed(2)}€!`;

      banners.push({
        id: `product-${activeProductPromo.id}`,
        type: "product",
        title_pt: "SUCULENTO E CRUNCHY!",
        title_en: "JUICY AND CRUNCHY!",
        subtitle_pt: `Experimenta o nosso "${p.name_pt}" com ${details_pt}`,
        subtitle_en: `Try our "${p.name_en || p.name_pt}" with ${details_en}`,
        buttonText_pt: "Quero Este",
        buttonText_en: "I Want This"
      });
    }

    return banners;
  }
}