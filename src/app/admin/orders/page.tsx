import OrdersTable from "@/components/admin/orderstable";
import { prisma } from "@/lib/prisma";
import { mapAdminOrders } from "@/lib/mappers/adminOrderMapper";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const ordersRaw = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: true } },
      payment: true,
      delivery: true,
      customer: true,
    },
  });

  const orders = mapAdminOrders(ordersRaw);

  return (
    <div  >
      <h1 className="text-2xl font-bold mb-4">Заказы</h1>
      <OrdersTable orders={orders} />
    </div>
  );
}