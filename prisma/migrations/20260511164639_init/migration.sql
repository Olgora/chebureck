/*
  Warnings:

  - You are about to drop the column `name` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Product` table. All the data in the column will be lost.
  - Added the required column `name_pt` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_pt` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "name",
ADD COLUMN     "name_en" TEXT,
ADD COLUMN     "name_pt" TEXT NOT NULL,
ADD COLUMN     "name_ru" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "desc_en" TEXT,
ADD COLUMN     "desc_pt" TEXT,
ADD COLUMN     "desc_ru" TEXT,
ADD COLUMN     "name_en" TEXT,
ADD COLUMN     "name_pt" TEXT NOT NULL,
ADD COLUMN     "name_ru" TEXT;
