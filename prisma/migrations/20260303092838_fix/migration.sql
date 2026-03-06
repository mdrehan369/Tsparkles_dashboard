-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_accountId_fkey";

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
