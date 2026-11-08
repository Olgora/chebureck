// src/app/actions/promoActions.ts
"use server";

import { PromoService } from "@/services/promo/promoservice";
import { revalidatePath } from "next/cache";

export async function handleSaveWeeklyPromo(formData: FormData) {
  const dayOfWeek = parseInt(formData.get("dayOfWeek") as string);
  const promoPrice = parseFloat(formData.get("promoPrice") as string);
  const isActive = formData.get("isActive") === "true";

  await PromoService.saveWeeklyPromo(dayOfWeek, promoPrice, isActive);
  revalidatePath("/admin/promos");
}

export async function handleCreateCoupon(formData: FormData) {
  const code = formData.get("code") as string;
  const type = formData.get("type") as string;
  const value = parseFloat(formData.get("value") as string);
  const expiryInput = formData.get("expiryDate") as string;
  const expiryDate = expiryInput ? new Date(expiryInput) : null;

  await PromoService.createCoupon(code, type, value, expiryDate);
  revalidatePath("/admin/promos");
}

export async function handleSaveProductPromo(formData: FormData) {
  const productId = formData.get("productId") as string;
  const type = formData.get("type") as string;
  const value = parseFloat(formData.get("value") as string);
  const isActive = formData.get("isActive") === "true";

  await PromoService.saveProductPromo(productId, type, value, isActive);
  revalidatePath("/admin/promos");
}

export async function handleDeleteWeeklyPromo(id: string) {
  await PromoService.deleteWeeklyPromo(id);
  revalidatePath("/admin/promos");
}

export async function handleDeleteCoupon(id: string) {
  await PromoService.deleteCoupon(id);
  revalidatePath("/admin/promos");
}

export async function handleDeleteProductPromo(id: string) {
  await PromoService.deleteProductPromo(id);
  revalidatePath("/admin/promos");
}