import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { sendTelegramMessage } from "@/lib/telegramm/sendTelegramMessage";
//const prisma = new PrismaClient();

// ✅ тип входящих данных
type CreateOrderBody = {
  name: string;
  phone: string;
  scheduledAt:string;
  items: {
    id: string;
    price: number;
    quantity: number;
  }[];

  paymentMethod: "CASH" | "CARD";
  deliveryMethod: "DELIVERY" | "PICKUP";
  address?: string;
  lang:string;
  
};

export async function POST(req: Request) {

  try {
    const body: CreateOrderBody = await req.json();

    const {
      name,
      phone,
      items,
      paymentMethod,
      deliveryMethod,
      address,
      scheduledAt,
      lang,
     
      
    } = body;
    
    // 🔒 базовая валидация
    if (!phone || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }

    // 💰 считаем сумму
    const totalPrice = items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    // 👤 ищем или создаём клиента
    const customer = await prisma.customer.upsert({
      where: { phone },
      update: {
        name,
      },
      create: {
        name,
        phone,
      },
    });

    // 📦 создаём заказ
    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        scheduledAt: new Date(scheduledAt),
        totalPrice,
        status: OrderStatus.PENDING,
        items: {
          create: items.map((i) => ({
            productId: i.id,
            quantity: i.quantity,
            price: i.price,
          })),
        },

        payment: {
          create: {
            method: paymentMethod,
            amount: totalPrice,
            status: "PENDING", // можно потом enum сделать
          },
        },

        delivery: {
          create: {
            method: deliveryMethod,
            address: address ?? null,
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
        delivery: true,
        customer: true,
        
      },
    });
const itemsText = order.items
  .map(
    (i) =>
      `- ${i.product?.name_pt ?? "Товар"} ×${i.quantity} — ${
        Number(i.price)  * i.quantity
      } ₽`
  )
  .join("\n");

try {
 await sendTelegramMessage(
  `🆕 <b>Новый заказ #${order.id.slice(-6)}</b>\n\n` +
  `👤 Клиент: ${order.customer?.name ?? "—"}\n` +
  `📞 Телефон: ${order.customer?.phone ?? "—"}\n\n` +
  `📅 Дата исполнения: ${
  body.scheduledAt ? new Date(body.scheduledAt).toLocaleString()
    : "—"
}\n\n` +
  `🚚 Доставка: ${order.delivery?.method ?? "—"}\n` +
  `📍 Адрес: ${order.delivery?.address ?? "—"}\n\n` +
  `💳 Оплата: ${order.payment?.method ?? "—"}\n\n` +
  `🍔 Позиции:\n${itemsText}\n\n` +
  `💰 Итого: ${order.totalPrice} ₽`
);
  console.log("✅ TELEGRAM SENT");
} catch (err) {
  console.error("❌ TELEGRAM ERROR:", err);
}
  

    return NextResponse.json(order);
  } catch (error) {
    console.error("ORDER CREATE ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}