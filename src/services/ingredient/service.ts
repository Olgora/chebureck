import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class IngredientService {
  // Получить все ингредиенты
  static async getAll() {
    const ingredients = await prisma.ingredient.findMany({
      orderBy: { createdAt: "desc" },
    });

    return ingredients.map((item) => ({
      ...item,
      price: Number(item.price),
    }));
  }

  // Создать новый ингредиент
  static async create(data: {
    name_pt: string;
    name_en?: string | null;
    price: number;
    isAvailable?: boolean;
  }) {
    const { name_pt, name_en, price, isAvailable = true } = data;

    const ingredient = await prisma.ingredient.create({
      data: {
        name_pt,
        name_en: name_en || null,
        price: Number(price),
        isAvailable,
      },
    });

    return {
      ...ingredient,
      price: Number(ingredient.price),
    };
  }

  // Обновить ингредиент (без any)
  static async update(
    id: string,
    data: {
      name_pt?: string;
      name_en?: string | null;
      price?: number;
      isAvailable?: boolean;
    }
  ) {
    const updateData: Prisma.IngredientUpdateInput = {
      ...(data.name_pt !== undefined && { name_pt: data.name_pt }),
      ...(data.name_en !== undefined && { name_en: data.name_en }),
      ...(data.price !== undefined && { price: Number(data.price) }),
      ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
    };

    return prisma.ingredient.update({
      where: { id },
      data: updateData,
    });
  }

  // Удалить ингредиент
  static async delete(id: string) {
    return prisma.ingredient.delete({
      where: { id },
    });
  }
}