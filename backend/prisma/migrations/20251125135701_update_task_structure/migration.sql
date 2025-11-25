-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_assignedTo_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_createdBy_fkey`;

-- Allow nullable client fields on aircrafts
ALTER TABLE `aircraft`
    MODIFY `clientName` VARCHAR(191) NULL,
    MODIFY `deliveryDeadline` VARCHAR(191) NULL;

-- Rename legacy task columns to new names
ALTER TABLE `task`
    CHANGE COLUMN `createdBy` `creatorId` INTEGER NOT NULL,
    CHANGE COLUMN `createdAt` `creationDate` VARCHAR(191) NOT NULL,
    CHANGE COLUMN `updatedAt` `dueDate` VARCHAR(191) NOT NULL;

-- Add storage for responsible user ids and backfill using previous assignment
ALTER TABLE `task`
    ADD COLUMN `responsibleUserIds` VARCHAR(191) NULL;

UPDATE `task`
SET `responsibleUserIds` = CAST(JSON_ARRAY(`assignedTo`) AS CHAR);

UPDATE `task`
SET `responsibleUserIds` = '[]'
WHERE `responsibleUserIds` IS NULL;

ALTER TABLE `task`
    MODIFY `responsibleUserIds` VARCHAR(191) NOT NULL;

-- Remove deprecated columns
ALTER TABLE `task`
    DROP COLUMN `assignedTo`,
    DROP COLUMN `title`,
    DROP COLUMN `priority`;

-- CreateTable
CREATE TABLE `Test` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aircraftId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `result` VARCHAR(191) NOT NULL,
    `datePerformed` VARCHAR(191) NOT NULL,
    `notes` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Test` ADD CONSTRAINT `Test_aircraftId_fkey` FOREIGN KEY (`aircraftId`) REFERENCES `Aircraft`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
