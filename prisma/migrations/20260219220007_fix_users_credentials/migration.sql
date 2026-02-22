/*
  Warnings:

  - The `gender` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[uid]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_uid_fkey";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "gender",
ADD COLUMN     "gender" VARCHAR(3)[];

-- DropEnum
DROP TYPE "Gender";

-- CreateIndex
CREATE UNIQUE INDEX "Users_uid_key" ON "Users"("uid");
