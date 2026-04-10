-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('A', 'B', 'C', 'D');

-- CreateTable
CREATE TABLE "influencer_master_list" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT,
    "niche" TEXT,
    "username" TEXT NOT NULL,
    "tiktokFollowers" TEXT,
    "facebookFollowers" TEXT,
    "instagramFollowers" TEXT,
    "tier" "Tier",
    "contentStyle" TEXT,
    "avgViews" TEXT,
    "contact" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "influencer_master_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencer_projects" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "clientId" INTEGER NOT NULL,
    "dynamicColumnsDef" JSONB DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "influencer_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_influencers" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "influencerId" INTEGER NOT NULL,
    "dynamicData" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_influencers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "influencer_master_list_username_key" ON "influencer_master_list"("username");

-- CreateIndex
CREATE UNIQUE INDEX "project_influencers_projectId_influencerId_key" ON "project_influencers"("projectId", "influencerId");

-- AddForeignKey
ALTER TABLE "influencer_projects" ADD CONSTRAINT "influencer_projects_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_influencers" ADD CONSTRAINT "project_influencers_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "influencer_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_influencers" ADD CONSTRAINT "project_influencers_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "influencer_master_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;
