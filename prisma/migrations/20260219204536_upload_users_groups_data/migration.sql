/*
  Warnings:

  - You are about to drop the column `finishedAt` on the `Credentials` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `isReviewed` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `isSolded` on the `Products` table. All the data in the column will be lost.
  - You are about to alter the column `degree` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(120)` to `VarChar(120)`.
  - The `gender` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `semester` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(15)` to `VarChar(2)`.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('M', 'F', 'O');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('ARTES', 'TEATRO', 'DANZAS', 'MUSICA', 'CANTO');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropIndex
DROP INDEX "Groups_profesorId_key";

-- DropIndex
DROP INDEX "Users_uid_key";

-- AlterTable
ALTER TABLE "Credentials" DROP COLUMN "finishedAt";

-- AlterTable
ALTER TABLE "Events" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Groups" ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'ARTES',
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Products" DROP COLUMN "imageId",
DROP COLUMN "isReviewed",
DROP COLUMN "isSolded",
ADD COLUMN     "feedback" VARCHAR(300),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isSold" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Styles" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "degree" SET NOT NULL,
ALTER COLUMN "degree" SET DATA TYPE VARCHAR(120),
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'O',
ALTER COLUMN "semester" SET DATA TYPE VARCHAR(2);

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_uid_fkey" FOREIGN KEY ("uid") REFERENCES "Credentials"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
