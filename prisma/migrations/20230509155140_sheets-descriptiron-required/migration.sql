/*
  Warnings:

  - A unique constraint covering the columns `[description]` on the table `sheets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "sheets_description_key" ON "sheets"("description");
