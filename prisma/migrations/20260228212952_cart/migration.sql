-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "inventory" INTEGER NOT NULL DEFAULT 10;

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "guestId" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT,
    "phoneNumber" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "guestId" TEXT,
    "phoneNumber" TEXT,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" SERIAL NOT NULL,
    "cartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_guestId_key" ON "Account"("guestId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_phoneNumber_key" ON "Account"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_guestId_key" ON "Cart"("guestId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_phoneNumber_key" ON "Cart"("phoneNumber");
