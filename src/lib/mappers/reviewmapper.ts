import type { PrismaReview } from "@/types/prismatypes";
import type { Review } from "@/types/index";

export function mapReview(r: PrismaReview): Review {
  return {
    id: r.id,
    name: r.name,
    phone: r.phone,
    rating: r.rating,
    comment: r.comment ?? null,
    isVerified: r.isVerified,
    createdAt: r.createdAt,
  };
}