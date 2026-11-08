import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const { orderId } = await req.json();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: true } },
      customer: true,
    
    },
  });

  if (!order) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],

    customer_email: order.customer?.email ?? undefined,

    line_items: order.items.map((item:any) => ({
      quantity: item.quantity,
      price_data: {
        currency: "eur",
        unit_amount: Number(item.price) * 100,
        product_data: {
          name: item.product?.name_pt ?? "Товар",
        },
      },
    })),

    // 🔥 СВЯЗЬ С ЗАКАЗОМ
    metadata: {
      orderId: order.id,
    },

    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${order.lang}/order/${order.id}?paid=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${order.lang}/order/${order.id}?canceled=1`,
  });

  return Response.json({ url: session.url });
}