import OrderClient from "@/components/orderclient/orderclient";
import { mapOrder } from "@/lib/mappers/ordermappers";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/dictionaries";
import { Language } from "@/types/index";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    lang: string;
    id: string;
  }>;
};

export default async function OrderPage({ params }: PageProps) {
  const { id, lang } = await params;
  const dict = await getDictionary(lang);
  const safeLocale = lang as Language;

  if (!id) {
    return <div>{dict.order.order_error}</div>;
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      items: {
        include: {
          product: {
            include: {
              images: true, // 👈 ВОТ ЭТО ГЛАВНОЕ
            },
          },
        },
      },
      payment: true,
      delivery: true,
    },
  });

  if (!order) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold">{dict.order.order_not_found}</h1>
      </div>
    );
  }

  const mappedOrder = mapOrder(order, safeLocale);

  return (
    <div className={styles.main}>
      <OrderClient order={mappedOrder}></OrderClient>
    </div>
  );
}
