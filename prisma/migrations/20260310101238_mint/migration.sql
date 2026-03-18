/*
  Warnings:

  - You are about to drop the column `certificateId` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `course` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `metadataURI` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `txHash` on the `Certificate` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,bootcampId]` on the table `Certificate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bootcampId` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentName` to the `Certificate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_userId_fkey";

-- DropIndex
DROP INDEX "Certificate_certificateId_key";

-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "certificateId",
DROP COLUMN "course",
DROP COLUMN "createdAt",
DROP COLUMN "metadataURI",
DROP COLUMN "txHash",
ADD COLUMN     "bootcampId" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "studentId" TEXT NOT NULL,
ADD COLUMN     "studentName" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "tokenId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_studentId_bootcampId_key" ON "Certificate"("studentId", "bootcampId");

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
