/*
  Warnings:

  - You are about to drop the column `date` on the `JobDescription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `JobDescription` DROP COLUMN `date`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `oauthProvider` VARCHAR(191) NULL,
    ADD COLUMN `oauthProviderId` VARCHAR(191) NULL,
    ADD COLUMN `plan` ENUM('free', 'pro', 'premium') NOT NULL DEFAULT 'free',
    ADD COLUMN `resetToken` VARCHAR(191) NULL,
    ADD COLUMN `resetTokenExpires` DATETIME(3) NULL,
    ADD COLUMN `stripeCustomerId` VARCHAR(191) NULL,
    ADD COLUMN `stripeSubscriptionId` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `verificationToken` VARCHAR(191) NULL,
    ADD COLUMN `verificationTokenExpires` DATETIME(3) NULL;
