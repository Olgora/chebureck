import { Prisma } from "@prisma/client";
import type { Review } from "@prisma/client";

export type PrismaProduct = Prisma.ProductGetPayload<{
  include: {
    category: true;
    images: true;
  };
}>;

export type PrismaCategory = Prisma.CategoryGetPayload<{
  include: {
    products: {
      include: {
        images: true;
        category: true;
      };
    };
  };
}>;

 

export type PrismaReview = Review;