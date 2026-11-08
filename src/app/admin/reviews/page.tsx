// app/admin/reviews/page.tsx

import { prisma } from "@/lib/prisma";
import ReviewsClient from "@/components/admin/reviews";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviewsRaw = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
  });

  const reviews = reviewsRaw.map((r:any) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reviews</h1>
      <ReviewsClient reviews={reviews} />
    </div>
  );
}
