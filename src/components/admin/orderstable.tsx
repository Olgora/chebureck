"use client";

import { useState, useEffect } from "react";
import { OrderStatus } from "@prisma/client";
import { statusLabel, statusColor } from "@/lib/orderstatus";
import StatusSelect from "@/components/admin/statusselect";
import { Decimal } from "@prisma/client/runtime/library";
import { formatPriceEUR } from "../utils/func";

type Order = {
  id: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  scheduledAt: string;

  customer: {
    name: string | null;
    phone: string;
  } | null;

  payment: {
    method: string;
    status: string;
  } | null;

  delivery: {
    method: string;
    address: string | null;
  } | null;

  items: {
    id: string;
    quantity: number;
    price: number;
    productName: string;
  }[];
};

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const [data, setData] = useState<Order[]>(orders);
  const [openId, setOpenId] = useState<string | null>(null);

  // polling
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const res = await fetch("/api/orders");
      if (!res.ok) return;

      const json = await res.json();

      if (mounted) setData(json);
    };

    load();
    const interval = setInterval(load, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  function toggle(id: string) {
    setOpenId((p) => (p === id ? null : id));
  }

  function updateStatus(orderId: string, status: OrderStatus) {
    setData((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );
  }

  return (
    <div className="space-y-2">
      {/* HEADER */}
      <div className="grid grid-cols-6 font-semibold border-b pb-2">
        <span>ID</span>
        <span>Статус</span>
        <span>Клиент</span>
        <span>Сумма</span>
        <span>Дата</span>
        <span></span>
      </div>

      {/* ROWS */}
      {data.map((order) => {
        const isOpen = openId === order.id;

        return (
          <div key={order.id} className="border rounded">
            {/* ROW */}
            <div className="grid grid-cols-6 items-center p-2">
              <span>#{order.id.slice(-6)}</span>

              <span
                className={`px-2 py-1 rounded text-xs ${statusColor[order.status]}`}
              >
                {statusLabel[order.status]}
              </span>

              <span>
                <div>{order.customer?.name ?? "—"}</div>
                <div className="text-xs text-gray-500">
                  {order.customer?.phone ?? "—"}
                </div>
              </span>

              <span>{formatPriceEUR(order.totalPrice)} </span>

              <span className="text-xs text-gray-500">
                {order.scheduledAt
                  ? new Date(order.scheduledAt).toLocaleString()
                  : "—"}
              </span>

              <button onClick={() => toggle(order.id)}>
                {isOpen ? "✕" : "▼"}
              </button>
            </div>

            {/* ACCORDION */}
            {isOpen && (
              <div className="p-3 border-t space-y-3 bg-gray-50">
                {/* DELIVERY */}
                <div>
                  <b>Доставка:</b> {order.delivery?.method}
                  {order.delivery?.address && (
                    <div className="text-sm text-gray-600">
                      {order.delivery.address}
                    </div>
                  )}
                </div>

                {/* PAYMENT */}
                <div>
                  <b>Оплата:</b> {order.payment?.method} (
                  {order.payment?.status})
                </div>

                {/* ITEMS */}
                <div>
                  <b>Состав заказа:</b>

                  <div className="mt-2 space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="grid grid-cols-4 text-sm">
                        <span>{item.productName ?? "Товар"}</span>
                        <span>{formatPriceEUR(item.price)} </span>

                        <span>× {item.quantity}</span>
                        <span>
                          {formatPriceEUR(item.price * item.quantity)}{" "}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* STATUS */}
                <StatusSelect
                  orderId={order.id}
                  currentStatus={order.status}
                  onStatusChange={(s) => updateStatus(order.id, s)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
