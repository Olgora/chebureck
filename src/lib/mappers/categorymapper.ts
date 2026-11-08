/*import { mapProduct } from "./productmapper";
import type { Category } from "@/types/index";
import type { PrismaCategory } from "@/types/prismatypes";


export function mapCategory(c: PrismaCategory): Category{
  return {
    id: c.id,
    name_pt: c.name_pt,
    name_en: c.name_en ?? null,
    products: c.products.map(mapProduct),
  };
}*/
// src/lib/mappers/categorymapper.ts
import { mapProduct } from "./productmapper";
import type { Category } from "@/types/index";
import type { PrismaCategory } from "@/types/prismatypes";
import type { WeeklyPromo } from "@prisma/client"; // Импортируем тип акции


export function mapCategory(c: PrismaCategory, activeWeeklyPromo: WeeklyPromo | null): Category {
  return {
    id: c.id,
    name_pt: c.name_pt,
    name_en: c.name_en ?? null,
    
    // 🌟 ВАЖНО: Разворачиваем стрелочную функцию, чтобы передать аргументы вручную!
    // Теперь JS не подставит сюда число-индекс, и TypeScript будет счастлив.
    products: c.products.map((product) => mapProduct(product, activeWeeklyPromo)),
  };
}