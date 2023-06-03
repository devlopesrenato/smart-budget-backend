-- DropForeignKey
ALTER TABLE "accounts-payable" DROP CONSTRAINT "accounts-payable_creatorUserId_fkey";

-- DropForeignKey
ALTER TABLE "accounts-payable" DROP CONSTRAINT "accounts-payable_sheetId_fkey";

-- DropForeignKey
ALTER TABLE "accounts-receivable" DROP CONSTRAINT "accounts-receivable_creatorUserId_fkey";

-- DropForeignKey
ALTER TABLE "accounts-receivable" DROP CONSTRAINT "accounts-receivable_sheetId_fkey";

-- DropForeignKey
ALTER TABLE "sheets" DROP CONSTRAINT "sheets_creatorUserId_fkey";

-- AddForeignKey
ALTER TABLE "accounts-payable" ADD CONSTRAINT "accounts-payable_creatorUserId_fkey" FOREIGN KEY ("creatorUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts-payable" ADD CONSTRAINT "accounts-payable_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "sheets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts-receivable" ADD CONSTRAINT "accounts-receivable_creatorUserId_fkey" FOREIGN KEY ("creatorUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts-receivable" ADD CONSTRAINT "accounts-receivable_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "sheets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sheets" ADD CONSTRAINT "sheets_creatorUserId_fkey" FOREIGN KEY ("creatorUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
