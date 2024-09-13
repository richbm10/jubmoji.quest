-- AlterEnum
ALTER TYPE "ProofType" ADD VALUE 'LOCATION';

-- CreateTable
CREATE TABLE "LocationQuest" (
    "questId" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "polygonCoordinates" JSONB NOT NULL,
    "polygonHash" TEXT NOT NULL,

    CONSTRAINT "LocationQuest_pkey" PRIMARY KEY ("questId")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "merkleRootHash" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LocationQuest" ADD CONSTRAINT "LocationQuest_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationQuest" ADD CONSTRAINT "LocationQuest_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
