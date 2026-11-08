import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { orderId } = await req.json();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: true } },
    },
  });

  if (!order) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],

    line_items: order.items.map((item:any) => ({
      quantity: item.quantity,
      price_data: {
        currency: "eur",
        unit_amount: Number(item.price) * 100,
        product_data: {
          name: item.product?.name_pt ?? "Product",
        },
      },
    })),

    metadata: {
      orderId: order.id, // 🔥 ВАЖНО
    },

    success_url: `http://localhost:3000/order/${order.id}`,
    cancel_url: `http://localhost:3000/order/${order.id}`,
  });

  return Response.json({ url: session.url });
}