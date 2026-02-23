/*
  Warnings:

  - A unique constraint covering the columns `[mail]` on the table `Credentials` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `groupId` to the `Styles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductPhoto" ADD COLUMN     "isMain" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Styles" ADD COLUMN     "groupId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Credentials_mail_key" ON "Credentials"("mail");

-- AddForeignKey
ALTER TABLE "Styles" ADD CONSTRAINT "Styles_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Groups"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
