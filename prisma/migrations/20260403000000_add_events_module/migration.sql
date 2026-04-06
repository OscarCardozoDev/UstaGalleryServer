-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('EXHIBITION', 'WORKSHOP', 'PERFORMANCE', 'CONFERENCE', 'OTHER');

-- CreateEnum
CREATE TYPE "EventPhotoType" AS ENUM ('HERO', 'PROMO', 'MEMORY');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "EventPhoto" DROP COLUMN "isHero",
ADD COLUMN     "photoType" "EventPhotoType" NOT NULL DEFAULT 'PROMO';

-- AlterTable
ALTER TABLE "Events" DROP COLUMN "date",
ADD COLUMN     "createdById" UUID NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "eventType" "EventType" NOT NULL DEFAULT 'EXHIBITION',
ADD COLUMN     "feedback" VARCHAR(500),
ADD COLUMN     "isVirtual" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "locationUrl" VARCHAR(500),
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "EventStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "streamingUrl" VARCHAR(500),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(1000);

-- AlterTable
ALTER TABLE "Photos" ALTER COLUMN "url" SET DATA TYPE VARCHAR(500);

-- CreateTable
CREATE TABLE "EventInvitation" (
    "uid" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "groupId" UUID NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventInvitation_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventInvitation_eventId_groupId_key" ON "EventInvitation"("eventId", "groupId");

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventInvitation" ADD CONSTRAINT "EventInvitation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Events"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventInvitation" ADD CONSTRAINT "EventInvitation_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Groups"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

