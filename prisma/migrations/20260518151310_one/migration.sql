/*
  Warnings:

  - You are about to drop the column `name_ru` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `description_ru` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `name_ru` on the `Product` table. All the data in the column will be lost.
  - Made the column `scheduledAt` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "name_ru";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "massage" TEXT,
ALTER COLUMN "scheduledAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "description_ru",
DROP COLUMN "name_ru";
