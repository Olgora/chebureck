/*
  Warnings:

  - You are about to drop the column `desc_en` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `desc_pt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `desc_ru` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "desc_en",
DROP COLUMN "desc_pt",
DROP COLUMN "desc_ru",
ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "description_pt" TEXT,
ADD COLUMN     "description_ru" TEXT;
