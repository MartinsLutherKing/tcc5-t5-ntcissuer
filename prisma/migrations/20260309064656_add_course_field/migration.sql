/*
  Warnings:

  - Added the required column `course` to the `Certificate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Certificate" ADD COLUMN     "course" TEXT NOT NULL,
ALTER COLUMN "tokenId" DROP NOT NULL,
ALTER COLUMN "txHash" DROP NOT NULL,
ALTER COLUMN "metadataURI" DROP NOT NULL;
