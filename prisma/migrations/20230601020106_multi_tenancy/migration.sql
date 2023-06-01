/*
  Warnings:

  - You are about to drop the column `updaterUserId` on the `accounts-payable` table. All the data in the column will be lost.
  - You are about to drop the column `updaterUserId` on the `accounts-receivable` table. All the data in the column will be lost.
  - Made the column `creatorUserId` on table `accounts-payable` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sheetId` on table `accounts-payable` required. This step will fail if there are existing NULL values in that column.
  - Made the column `creatorUserId` on table `accounts-receivable` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sheetId` on table `accounts-receivable` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `creatorUserId` to the `sheets` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "accounts-payable" DROP CONSTRAINT "accounts-payable_creatorUserId_fkey";

-- DropForeignKey
ALTER TABLE "accounts-payable" DROP CONSTRAINT "accounts-payable_sheetId_fkey";

-- DropForeignKey
ALTER TABLE "accounts-payable" DROP CONSTRAINT "accounts-payable_updaterUserId_fkey";

-- DropForeignKey
ALTER TABLE "accounts-receivable" DROP CONSTRAINT "accounts-receivable_creatorUserId_fkey";

-- DropForeignKey
ALTER TABLE "accounts-receivable" DROP CONSTRAINT "accounts-receivable_sheetId_fkey";

-- DropForeignKey
ALTER TABLE "accounts-receivable" DROP CONSTRAINT "accounts-receivable_updaterUserId_fkey";

-- AlterTable
ALTER TABLE "accounts-payable" DROP COLUMN "updaterUserId",
ALTER COLUMN "creatorUserId" SET NOT NULL,
ALTER COLUMN "sheetId" SET NOT NULL;

-- AlterTable
ALTER TABLE "accounts-receivable" DROP COLUMN "updaterUserId",
ALTER COLUMN "creatorUserId" SET NOT NULL,
ALTER COLUMN "sheetId" SET NOT NULL;

-- AlterTable
ALTER TABLE "sheets" ADD COLUMN     "creatorUserId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "accounts-payable" ADD CONSTRAINT "accounts-payable_creatorUserId_fkey" FOREIGN KEY ("creatorUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts-payable" ADD CONSTRAINT "accounts-payable_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "sheets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts-receivable" ADD CONSTRAINT "accounts-receivable_creatorUserId_fkey" FOREIGN KEY ("creatorUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts-receivable" ADD CONSTRAINT "accounts-receivable_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "sheets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sheets" ADD CONSTRAINT "sheets_creatorUserId_fkey" FOREIGN KEY ("creatorUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
