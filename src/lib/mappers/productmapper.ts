import { toNumber } from "./decimal";
import type { Product } from "@/types/index";
import type { PrismaProduct } from "@/types/prismatypes";
import type { WeeklyPromo, ProductPromo, Ingredient } from "@prisma/client"; // 🧀 Добавляем тип Ingredient

const CHEBUREK_CATEGORY_ID = "cmpbj5uhf0000cresgi3qk115";

// Расширяем тип PrismaProduct, добавляя акции и список ингредиентов
type PrismaProductWithPromo = PrismaProduct & {
  productPromo?: ProductPromo | null;
  // 🧀 Prisma подтягивает массив доступных ингредиентов (если они включены в запрос)
  availableIngredients?: Ingredient[];
};

export function mapProduct(
  p: PrismaProductWithPromo,
  activeWeeklyPromo: WeeklyPromo | null
): Product {
  const basePrice = toNumber(p.price);
  let currentPrice = basePrice;
  let hasDiscount = false;
  let discountText = "";

  // 1. Проверяем приоритет №1: Глобальная акция дня недели (например, Понедельник)
  if (
    activeWeeklyPromo &&
    activeWeeklyPromo.isActive &&
    p.categoryId === CHEBUREK_CATEGORY_ID
  ) {
    currentPrice = toNumber(activeWeeklyPromo.promoPrice);
    hasDiscount = true;
    discountText = `day_${activeWeeklyPromo.dayOfWeek}`;
  }
  // 2. Проверяем приоритет №2: Индивидуальная скидка на этот конкретный чебурек
  else if (p.productPromo && p.productPromo.isActive) {
    hasDiscount = true;
    const promo = p.productPromo;
    const promoValue = toNumber(promo.value);

    if (promo.type === "FIXED") {
      currentPrice = promoValue;
      discountText = "Promo";
    } else if (promo.type === "PERCENT") {
      currentPrice = basePrice * (1 - promoValue / 100);
      discountText = `-${promoValue}%`;
    }
  }

  // 3. 🧀 Маппим ингредиенты: безопасно преобразуем Decimal цены в Number
  const availableIngredients = Array.isArray(p.availableIngredients)
    ? p.availableIngredients.map((ing) => ({
        id: ing.id,
        name_pt: ing.name_pt,
        name_en: ing.name_en ?? null,
        price: toNumber(ing.price),
        isAvailable: ing.isAvailable,
      }))
    : [];

  return {
    id: p.id,
    name_pt: p.name_pt,
    name_en: p.name_en ?? null,
    description_pt: p.description_pt ?? null,
    description_en: p.description_en ?? null,
    price: basePrice,
    categoryId: p.categoryId,
    images: p.images,

    // Маркетинговые данные
    currentPrice: Number(currentPrice.toFixed(2)),
    hasDiscount,
    discountText,

    // 🧀 Пробрасываем список допов в возвращаемый объект товара
    availableIngredients,
  };
}



/*import { toNumber } from "./decimal";
import type { Product } from "@/types/index";
import type { PrismaProduct } from "@/types/prismatypes";



export function mapProduct(p: PrismaProduct): Product {
  return {
   id:p.id,
   name_pt: p.name_pt,
   name_en: p.name_en ?? null,
   description_pt:  p.description_pt ?? null,
   description_en:  p.description_en ?? null,
   price: toNumber(p.price),
   categoryId: p.categoryId,
   images: p.images,
  };
}*/
// @/lib/mappers/productmapper.ts
/*import { toNumber } from "./decimal";
import type { Product } from "@/types/index";
import type { PrismaProduct } from "@/types/prismatypes";
import type { WeeklyPromo, ProductPromo } from "@prisma/client"; // Импортируем тип акции из Prisma
const CHEBUREK_CATEGORY_ID = "cmpbj5uhf0000cresgi3qk115";

// Расширяем тип PrismaProduct, чтобы маппер видел пришедшую из БД скидку
type PrismaProductWithPromo = PrismaProduct & {
  // 🌟 Говорим, что берем структуру из ProductPromo, но делаем её опциональной
  productPromo?: ProductPromo | null; 
};

export function mapProduct(p: PrismaProductWithPromo, activeWeeklyPromo: WeeklyPromo | null): Product {
  const basePrice = toNumber(p.price);
  let currentPrice = basePrice;
  let hasDiscount = false;
  let discountText= "";
     
 
  // 1. Проверяем приоритет №1: Глобальная акция дня недели (например, Понедельник)
 if (activeWeeklyPromo && activeWeeklyPromo.isActive && p.categoryId === CHEBUREK_CATEGORY_ID) {
     
    currentPrice = toNumber(activeWeeklyPromo.promoPrice); // Используем твой хелпер toNumber
    hasDiscount = true;
    discountText = `day_${activeWeeklyPromo.dayOfWeek}`;
  } 
  // 2. Проверяем приоритет №2: Индивидуальная скидка на этот конкретный чебурек
  else if (p.productPromo && p.productPromo.isActive) {
    hasDiscount = true;
    const promo = p.productPromo;
    const promoValue = toNumber(promo.value);

    if (promo.type === "FIXED") {
      currentPrice = promoValue;
      discountText = "Promo";
    } else if (promo.type === "PERCENT") {
      currentPrice = basePrice * (1 - promoValue / 100);
      discountText = `-${promoValue}%`;
    }
  }

  return {
    id: p.id,
    name_pt: p.name_pt,
    name_en: p.name_en ?? null,
    description_pt: p.description_pt ?? null,
    description_en: p.description_en ?? null,
    price: basePrice, // Исходная цена остаётся нетронутой
    categoryId: p.categoryId,
    images: p.images,

    // 🌟 Записываем маркетинговый результат:
    currentPrice: Number(currentPrice.toFixed(2)),
    hasDiscount,
    discountText,
  };
}
*/
