import { prisma } from "@/lib/prisma";

export async function getReviews() {
  return prisma.review.findMany({
    orderBy: { createdAt: "desc" },
  });
}