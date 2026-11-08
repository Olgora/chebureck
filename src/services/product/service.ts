import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/mappers/productmapper";

export class ProductService {
  static async getAll() {
    const currentDay = new Date().getDay();

    const activeWeeklyPromo = await prisma.weeklyPromo.findFirst({
      where: { 
        dayOfWeek: currentDay, 
        isActive: true 
      }
    });

    const products = await prisma.product.findMany({
      where: { isAvailable: true },
      include: {
        category: true,
        images: { orderBy: { position: "asc" } },
        productPromo: true,
        availableIngredients: { where: { isAvailable: true } }, // 🧀 подтягиваем доступные к чебуреку ингредиенты
      },
      orderBy: { createdAt: "desc" },
    });

    return products.map((product) => mapProduct(product, activeWeeklyPromo));
  }
  
  static async getAllAdmin() {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: { orderBy: { position: "asc" } },
        availableIngredients: true, // 🧀 подтягиваем все привязанные ингредиенты
      },
      orderBy: { createdAt: "desc" },
    });

    return products.map((p) => ({
      ...p,
      price: Number(p.price),
      availableIngredients: p.availableIngredients.map((ing) => ({
        ...ing,
        price: Number(ing.price),
      })),
    }));
  }

  static async create(data: {
    name_pt: string;
    name_en?: string | null;
    description_pt?: string | null;
    description_en?: string | null;
    price: number;
    categoryId: string;
    images?: string[];
    ingredientIds?: string[]; // 🧀 массив ID выбранных ингредиентов
  }) {
    const { images = [], ingredientIds = [], ...rest } = data;

    const product = await prisma.product.create({
      data: {
        ...rest,
        price: Number(rest.price),
        // Привязываем переданные ингредиенты
        availableIngredients: ingredientIds.length
          ? {
              connect: ingredientIds.map((id) => ({ id })),
            }
          : undefined,
      },
    });

    if (images.length) {
      await prisma.productImage.createMany({
        data: images.map((url, index) => ({
          url,
          productId: product.id,
          position: index,
          isMain: index === 0,
        })),
      });
    }

    return product;
  }

  static async update(
    id: string,
    data: {
      name_pt?: string;
      name_en?: string | null;
      description_pt?: string | null;
      description_en?: string | null;
      price?: number;
      categoryId?: string;
      images?: string[];
      ingredientIds?: string[]; // 🧀 новый список ID ингредиентов
    }
  ) {
    const { images, ingredientIds, price, ...rest } = data;

    await prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(price !== undefined && { price: Number(price) }),
        // Полностью перезаписываем список привязанных ингредиентов через set
        ...(ingredientIds !== undefined && {
          availableIngredients: {
            set: ingredientIds.map((ingId) => ({ id: ingId })),
          },
        }),
      },
    });

    // Если был передан массив картинок — пересоздаём их
    if (images !== undefined) {
      await prisma.productImage.deleteMany({
        where: { productId: id },
      });

      if (images.length) {
        await prisma.productImage.createMany({
          data: images.map((url, index) => ({
            url,
            productId: id,
            position: index,
            isMain: index === 0,
          })),
        });
      }
    }
  }

  static async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}