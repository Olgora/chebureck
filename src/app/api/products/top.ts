// /api/products/top
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isAvailable: true },
    take: 3,
    include: { images: true },
  });

  return Response.json(products);
}