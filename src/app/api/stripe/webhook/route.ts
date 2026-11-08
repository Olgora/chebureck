import Stripe from "stripe";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");

  if (!sig) {
    return new Response("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("❌ Webhook signature error:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  // 💳 УСПЕШНАЯ ОПЛАТА
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const orderId = session.metadata?.orderId;

    if (!orderId) {
      return new Response("Missing orderId", { status: 400 });
    }

    try {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "CONFIRMED",
          payment: {
            update: {
              status: "PAID",
            },
          },
        },
      });

      console.log("✅ Order paid:", orderId);
    } catch (e) {
      console.error("❌ DB update error:", e);
      return new Response("DB error", { status: 500 });
    }
  }

  return new Response("OK", { status: 200 });
}