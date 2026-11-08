import { Prisma } from "@prisma/client";
import { OrderStatus } from "@prisma/client";

type PrismaOrder = Prisma.OrderGetPayload<{
  include: {
    items: { include: { product: true } };
    payment: true;
    delivery: true;
    customer: true;
  };
}>;

export type AdminOrder = {
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

export function mapAdminOrders(orders: PrismaOrder[]): AdminOrder[] {
  return orders.map((order) => ({
    id: order.id,
    status: order.status,
    totalPrice: Number(order.totalPrice),
    createdAt: order.createdAt.toISOString(),
    scheduledAt: order.scheduledAt.toISOString(),

    customer: order.customer
      ? {
          name: order.customer.name,
          phone: order.customer.phone,
        }
      : null,

    payment: order.payment
      ? {
          method: order.payment.method,
          status: order.payment.status,
        }
      : null,

    delivery: order.delivery
      ? {
          method: order.delivery.method,
          address: order.delivery.address ?? null,
        }
      : null,

    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: Number(item.price),
      productName: item.product?.name_pt ?? "Товар",
    })),
  }));
}