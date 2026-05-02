-- DropIndex
DROP INDEX "Users_idCard_key";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "degree",
DROP COLUMN "idCard",
DROP COLUMN "semester",
ADD COLUMN     "roleData" JSONB,
ADD COLUMN     "roleId" UUID;

-- CreateTable
CREATE TABLE "Roles" (
    "uid" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Roles_name_key" ON "Roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Roles_slug_key" ON "Roles"("slug");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
