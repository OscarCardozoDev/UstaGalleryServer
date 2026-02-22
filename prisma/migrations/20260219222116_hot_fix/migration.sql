/*
  Warnings:

  - You are about to alter the column `gender` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(3)` to `VarChar(3)`.
  - You are about to alter the column `degree` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(120)` to `VarChar(120)`.

*/
-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "gender" SET NOT NULL,
ALTER COLUMN "gender" SET DATA TYPE VARCHAR(3),
ALTER COLUMN "degree" SET NOT NULL,
ALTER COLUMN "degree" SET DATA TYPE VARCHAR(120);
