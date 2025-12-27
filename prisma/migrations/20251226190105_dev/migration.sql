/*
  Warnings:

  - You are about to drop the column `assetId` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `Asset` table. All the data in the column will be lost.
  - Added the required column `fileId` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_assetId_fkey";

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "assetId",
DROP COLUMN "publicId",
ADD COLUMN     "fileId" TEXT NOT NULL,
ADD COLUMN     "reviewId" INTEGER;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE SET NULL ON UPDATE CASCADE;
