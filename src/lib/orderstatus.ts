import { OrderStatus } from "@prisma/client";

export const statusLabel: Record<OrderStatus, string> = {
  PENDING: "Новый",
  CONFIRMED: "Подтверждён",
  COOKING: "Готовится",
  READY: "Готов",
  DELIVERING: "Доставка",
  COMPLETED: "Завершён",
  CANCELLED: "Отменён",
};

export const statusColor: Record<OrderStatus, string> = {
  PENDING: "bg-red-200 text-gray-800",
  CONFIRMED: "bg-blue-200 text-blue-800",
  COOKING: "bg-yellow-200 text-yellow-800",
  READY: "bg-green-200 text-green-800",
  DELIVERING: "bg-indigo-200 text-indigo-800",
  COMPLETED: "bg-green-200 text-emerald-800",
  CANCELLED: "bg-black-200 text-red-800",
};