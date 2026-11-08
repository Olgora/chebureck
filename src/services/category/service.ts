import { prisma } from "@/lib/prisma";
import { mapCategory } from "@/lib/mappers/categorymapper";

export class CategoryService {
  static async getMenu() {
    try {
      // 1. Узнаем, какой сегодня день недели, и ищем акцию
      const currentDay = new Date().getDay();
      const activeWeeklyPromo = await prisma.weeklyPromo.findFirst({
        where: { dayOfWeek: currentDay, isActive: true },
      });

      // 2. Тянем категории и продукты вместе со скидками и ингредиентами
      const categories = await prisma.category.findMany({
        include: {
          products: {
            where: { isAvailable: true }, // только активные для меню товары
            include: {
              images: { orderBy: { position: "asc" } },
              category: true,
              productPromo: true,
              // 🧀 Подтягиваем доступные к чебуреку ингредиенты:
              availableIngredients: {
                where: { isAvailable: true }, // только активные добавки
              },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      });

      // 3. Передаем акцию дня в маппер категорий
      return categories.map((category) => mapCategory(category, activeWeeklyPromo));
    } catch (error) {
      // Если база недоступна (например, во время docker build), возвращаем пустой список
      console.warn("База данных недоступна, отдаем пустой массив меню:", error);
      return [];
    }
  }
}