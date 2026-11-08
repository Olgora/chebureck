"use client";

import { OrderStatus } from "@prisma/client";

type Props = {
  orderId: string;
  currentStatus: OrderStatus;
  onStatusChange: (status: OrderStatus) => void;
};

export default function StatusSelect({
  orderId,
  currentStatus,
  onStatusChange,
}: Props) {
  async function changeStatus(status: OrderStatus) {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      console.error("Status update failed");
      return;
    }

    // 🔥 сразу обновляем UI (НЕ reload)
    onStatusChange(status);
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {Object.values(OrderStatus).map((status) => (
        <button
          key={status}
          onClick={() => changeStatus(status)}
          className={`
            px-2 py-1 text-xs border rounded
            ${status === currentStatus ? "bg-black text-white" : "hover:bg-gray-100"}
          `}
        >
          {status}
        </button>
      ))}
    </div>
  );
}