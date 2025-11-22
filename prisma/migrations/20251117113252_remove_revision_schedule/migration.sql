/*
  Warnings:

  - You are about to drop the column `revision_schedule` on the `Analytics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Analytics" DROP COLUMN "revision_schedule";
