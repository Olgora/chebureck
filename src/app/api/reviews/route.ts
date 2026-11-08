import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


type CreateReviewBody = {
  name: string;
  phone: string;
  rating: number;
  comment?: string;
};


export async function POST(req: Request) {
  try {
    const body: CreateReviewBody = await req.json();

    const { name, phone, rating, comment } = body;

    if (!phone || !rating) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }

    // 🔍 проверяем, был ли заказ
    const hasOrders = await prisma.order.findFirst({
      where: {
        customer: {
          phone,
        },
      },
    });

    const review = await prisma.review.create({
      data: {
        name: name,
        phone,
        rating,
        comment: comment ?? null,
        isVerified: !!hasOrders,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("REVIEW ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
 
export async function GET() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return Response.json(reviews);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  await prisma.review.delete({
    where: { id },
  });

  return Response.json({ ok: true });
}