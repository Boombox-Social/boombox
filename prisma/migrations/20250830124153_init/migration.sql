-- CreateTable
CREATE TABLE "public"."Client" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "info" TEXT NOT NULL,
    "logoUrl" TEXT,
    "industry" TEXT NOT NULL,
    "links" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "niche" TEXT,
    "businessAge" TEXT,
    "description" TEXT,
    "coreProducts" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "idealCustomer" TEXT,
    "brandEmotion" TEXT,
    "uniqueSelling" TEXT,
    "mainGoal" TEXT,
    "competitors" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "inspo" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "brandColors" TEXT,
    "fontUsed" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);
