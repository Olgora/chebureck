"use client";

import { OrderStatus } from "@prisma/client";

const FLOW: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "COOKING",
  "READY",
  "DELIVERING",
  "COMPLETED",
];

export default function StatusButtons({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  async function setStatus(status: OrderStatus) {
    await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {FLOW.map((status) => (
        <button
          key={status}
          onClick={() => setStatus(status)}
          className={`px-2 py-1 border text-xs rounded ${
            currentStatus === status
              ? "bg-black text-white"
              : ""
          }`}
        >
          {label(status)}
        </button>
      ))}
    </div>
  );
}

function label(status: OrderStatus) {
  const map: Record<OrderStatus, string> = {
    PENDING: "Новый",
    CONFIRMED: "Подтверждён",
    COOKING: "Готовится",
    READY: "Готов",
    DELIVERING: "Доставка",
    COMPLETED: "Завершён",
    CANCELLED: "Отменён",
  };

  return map[status];
}