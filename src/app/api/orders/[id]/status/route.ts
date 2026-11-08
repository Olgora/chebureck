import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body: { status: OrderStatus } = await req.json();

    // 🧠 защита enum
    if (!Object.values(OrderStatus).includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("STATUS UPDATE ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to update status",
        details: String(error),
      },
      { status: 500 }
    );
  }
}