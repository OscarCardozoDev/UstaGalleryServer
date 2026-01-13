/*
  Warnings:

  - The primary key for the `Credentials` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `Credentials` table. All the data in the column will be lost.
  - You are about to alter the column `password` on the `Credentials` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - The primary key for the `Groups` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Groups` table. All the data in the column will be lost.
  - The primary key for the `UserTypes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserTypes` table. All the data in the column will be lost.
  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `finishedAt` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the `_GroupMembers` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[profesorId]` on the table `Groups` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uid]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mail` to the `Credentials` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `uid` on the `Credentials` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `uid` was added to the `Groups` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `profesorId` on the `Groups` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `uid` was added to the `UserTypes` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `uid` on the `Users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userTypeId` on the `Users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Groups" DROP CONSTRAINT "Groups_profesorId_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_userTypeId_fkey";

-- DropForeignKey
ALTER TABLE "_GroupMembers" DROP CONSTRAINT "_GroupMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupMembers" DROP CONSTRAINT "_GroupMembers_B_fkey";

-- DropIndex
DROP INDEX "Credentials_email_key";

-- AlterTable
ALTER TABLE "Credentials" DROP CONSTRAINT "Credentials_pkey",
DROP COLUMN "email",
ADD COLUMN     "finishedAt" TIMESTAMP(3),
ADD COLUMN     "mail" VARCHAR(100) NOT NULL,
DROP COLUMN "uid",
ADD COLUMN     "uid" UUID NOT NULL,
ALTER COLUMN "password" SET DATA TYPE VARCHAR(250),
ADD CONSTRAINT "Credentials_pkey" PRIMARY KEY ("uid");

-- AlterTable
ALTER TABLE "Groups" DROP CONSTRAINT "Groups_pkey",
DROP COLUMN "id",
ADD COLUMN     "uid" UUID NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
DROP COLUMN "profesorId",
ADD COLUMN     "profesorId" UUID NOT NULL,
ADD CONSTRAINT "Groups_pkey" PRIMARY KEY ("uid");

-- AlterTable
ALTER TABLE "UserTypes" DROP CONSTRAINT "UserTypes_pkey",
DROP COLUMN "id",
ADD COLUMN     "uid" UUID NOT NULL,
ADD CONSTRAINT "UserTypes_pkey" PRIMARY KEY ("uid");

-- AlterTable
ALTER TABLE "Users" DROP CONSTRAINT "Users_pkey",
DROP COLUMN "finishedAt",
ADD COLUMN     "finishAt" TIMESTAMP(3),
ADD COLUMN     "isProfesor" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "uid",
ADD COLUMN     "uid" UUID NOT NULL,
DROP COLUMN "userTypeId",
ADD COLUMN     "userTypeId" UUID NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "lastName" SET DATA TYPE VARCHAR(30),
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("uid");

-- DropTable
DROP TABLE "_GroupMembers";

-- CreateTable
CREATE TABLE "UsersGroups" (
    "uid" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "groupId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsersGroups_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Products" (
    "uid" UUID NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "price" DECIMAL(8,2),
    "isSoled" BOOLEAN NOT NULL DEFAULT false,
    "madeAt" TIMESTAMP(3) NOT NULL,
    "groupId" UUID NOT NULL,
    "imageId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Styles" (
    "uid" UUID NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Styles_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "ProductStyle" (
    "uid" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "styleId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductStyle_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Photos" (
    "uid" UUID NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "url" VARCHAR(300) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Photos_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "ProductPhoto" (
    "uid" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "photoId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductPhoto_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Events" (
    "uid" UUID NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "EventProduct" (
    "uid" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventProduct_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "EventPhoto" (
    "uid" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "photoId" UUID NOT NULL,
    "isHero" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventPhoto_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "UserProduct" (
    "uid" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "isAuthor" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProduct_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "GroupEvent" (
    "uid" UUID NOT NULL,
    "groupId" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupEvent_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "UsersGroups_userId_groupId_key" ON "UsersGroups"("userId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductStyle_productId_styleId_key" ON "ProductStyle"("productId", "styleId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductPhoto_productId_photoId_key" ON "ProductPhoto"("productId", "photoId");

-- CreateIndex
CREATE UNIQUE INDEX "EventProduct_productId_eventId_key" ON "EventProduct"("productId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "EventPhoto_eventId_photoId_key" ON "EventPhoto"("eventId", "photoId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProduct_userId_productId_key" ON "UserProduct"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupEvent_groupId_eventId_key" ON "GroupEvent"("groupId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Groups_profesorId_key" ON "Groups"("profesorId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_uid_key" ON "Users"("uid");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_userTypeId_fkey" FOREIGN KEY ("userTypeId") REFERENCES "UserTypes"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Groups" ADD CONSTRAINT "Groups_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES "Users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersGroups" ADD CONSTRAINT "UsersGroups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersGroups" ADD CONSTRAINT "UsersGroups_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Groups"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Groups"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductStyle" ADD CONSTRAINT "ProductStyle_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductStyle" ADD CONSTRAINT "ProductStyle_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Styles"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPhoto" ADD CONSTRAINT "ProductPhoto_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPhoto" ADD CONSTRAINT "ProductPhoto_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photos"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventProduct" ADD CONSTRAINT "EventProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventProduct" ADD CONSTRAINT "EventProduct_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Events"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventPhoto" ADD CONSTRAINT "EventPhoto_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Events"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventPhoto" ADD CONSTRAINT "EventPhoto_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photos"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProduct" ADD CONSTRAINT "UserProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProduct" ADD CONSTRAINT "UserProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupEvent" ADD CONSTRAINT "GroupEvent_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Groups"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupEvent" ADD CONSTRAINT "GroupEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Events"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
