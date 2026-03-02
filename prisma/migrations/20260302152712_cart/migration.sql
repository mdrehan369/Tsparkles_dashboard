/*
  Warnings:

  - You are about to drop the column `guestId` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Cart` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accountId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountId` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Cart_guestId_key";

-- DropIndex
DROP INDEX "Cart_phoneNumber_key";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "guestId",
DROP COLUMN "phoneNumber",
ADD COLUMN     "accountId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Cart_accountId_key" ON "Cart"("accountId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_id_fkey" FOREIGN KEY ("id") REFERENCES "Cart"("accountId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
