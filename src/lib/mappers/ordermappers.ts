import { Prisma } from "@prisma/client";
import { Language } from "@/types/index";

type PrismaOrder = Prisma.OrderGetPayload<{
  include: {
    customer: true;
    items: {
      include: {
        product: {
          include: {
            images: true;
          };
        };
      };
    };
    payment: true;
    delivery: true;
  };
}>;

export function mapOrder(order: PrismaOrder, locale: Language) {
  return {
    id: order.id,
    status: order.status,

    totalPrice: order.totalPrice.toNumber(),

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
          address: order.delivery.address,
        }
      : null,

    items: order.items.map((item) => {
      const images = item.product.images ?? [];

      const sorted = [...images].sort(
        (a, b) => a.position - b.position
      );

      const mainImage =
        images.find((img) => img.isMain)?.url ??
        sorted[0]?.url ??
        null;

      const thumbnailImage =
        images.find((img) => img.isThumbnail)?.url ??
        mainImage;

      return {
        id: item.id,
        quantity: item.quantity,
        price: item.price.toNumber(),

        productName:
          item.product[`name_${locale}` as "name_pt" | "name_en"] ??
          "Товар",

        image: mainImage,
        imageThumbnail: thumbnailImage,
      };
    }),
  };
}