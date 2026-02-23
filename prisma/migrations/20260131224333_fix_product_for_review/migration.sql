/*
  Warnings:

  - You are about to drop the column `isSoled` on the `Products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Products" DROP COLUMN "isSoled",
ADD COLUMN     "isReviewed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSolded" BOOLEAN NOT NULL DEFAULT false;
