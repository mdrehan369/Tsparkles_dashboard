/*
  Warnings:

  - You are about to drop the column `guestId` on the `Account` table. All the data in the column will be lost.
  - Made the column `email` on table `Account` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Account_guestId_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "guestId",
ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "num" INTEGER DEFAULT 1,
ADD COLUMN     "size" TEXT;
