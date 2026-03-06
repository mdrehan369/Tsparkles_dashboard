/*
  Warnings:

  - You are about to drop the column `num` on the `CartItem` table. All the data in the column will be lost.
  - Added the required column `slug` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "num",
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "slug" TEXT NOT NULL;
