-- CreateTable
CREATE TABLE "VerificationCodes" (
    "uid" UUID NOT NULL,
    "credentialUid" UUID NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationCodes_pkey" PRIMARY KEY ("uid")
);
