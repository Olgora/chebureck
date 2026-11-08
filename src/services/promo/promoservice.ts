// src/services/PromoService.ts
import { prisma } from "@/lib/prisma";

export class PromoService {
  // 1. Управление акциями дней недели (Happy Monday)
  static async saveWeeklyPromo(dayOfWeek: number, promoPrice: number, isActive: boolean) {
    const existing = await prisma.weeklyPromo.findFirst({
      where: { dayOfWeek }
    });

    if (existing) {
      return prisma.weeklyPromo.update({
        where: { id: existing.id },
        data: { 
          promoPrice: Number(promoPrice), // Используем точное имя из твоей БД
          isActive 
        }
      });
    }

    return prisma.weeklyPromo.create({
      data: { 
        dayOfWeek, 
        promoPrice: Number(promoPrice), 
        isActive 
      }
    });
  }
static async getWeeklyPromos() {
    return prisma.weeklyPromo.findMany({
      orderBy: { dayOfWeek: "asc" }
    });
  }

  static async getActiveCoupons() {
    return prisma.coupon.findMany({
      orderBy: { createdAt: "desc" }
    });
  }

  static async getProductPromos() {
    return prisma.productPromo.findMany({
      include: {
        product: true // Подтягиваем инфо о чебуреке, чтобы знать имя
      },
      orderBy: { updatedAt: "desc" }
    });
  }
  // 2. Управление промокодами / купонами
  static async createCoupon(code: string, type: string, value: number, expiryDate?: Date | null) {
    return prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        type,
        value: Number(value),
        expiryDate,
        isActive: true
      }
    });
  }

  // 3. Управление скидками на конкретный чебурек
  static async saveProductPromo(productId: string, type: string, value: number, isActive: boolean) {
    return prisma.productPromo.upsert({
      where: { productId },
      update: { type, value: Number(value), isActive },
      create: { productId, type, value: Number(value), isActive }
    });
  }

  static async deleteWeeklyPromo(id: string) {
    return prisma.weeklyPromo.delete({ where: { id } });
  }

  static async deleteCoupon(id: string) {
    return prisma.coupon.delete({ where: { id } });
  }

  static async deleteProductPromo(id: string) {
    return prisma.productPromo.delete({ where: { id } });
  }
}