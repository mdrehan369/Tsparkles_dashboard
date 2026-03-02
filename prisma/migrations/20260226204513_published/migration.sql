/*
  Warnings:

  - A unique constraint covering the columns `[fileId]` on the table `Asset` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorName` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "authorName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Asset_fileId_key" ON "Asset"("fileId");
