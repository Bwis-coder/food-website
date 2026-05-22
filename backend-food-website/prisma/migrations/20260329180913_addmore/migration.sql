/*
  Warnings:

  - You are about to drop the column `resTokenExpiry` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `resTokenExpiry`,
    ADD COLUMN `resetTokenExpiry` DATETIME(3) NULL;
