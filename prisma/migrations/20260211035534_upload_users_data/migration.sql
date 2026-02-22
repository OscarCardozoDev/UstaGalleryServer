/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idCard]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[photoId]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idCard` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semester` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "degree" VARCHAR(30)[],
ADD COLUMN     "description" VARCHAR(500),
ADD COLUMN     "gender" VARCHAR(3)[],
ADD COLUMN     "idCard" VARCHAR(12) NOT NULL,
ADD COLUMN     "photoId" UUID,
ADD COLUMN     "semester" VARCHAR(15) NOT NULL,
ADD COLUMN     "username" VARCHAR(30) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_idCard_key" ON "Users"("idCard");

-- CreateIndex
CREATE UNIQUE INDEX "Users_photoId_key" ON "Users"("photoId");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photos"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
