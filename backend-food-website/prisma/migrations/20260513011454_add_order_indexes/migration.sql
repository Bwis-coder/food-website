-- CreateIndex
CREATE INDEX `Order_status_idx` ON `Order`(`status`);

-- RenameIndex
ALTER TABLE `order` RENAME INDEX `Order_userId_fkey` TO `Order_userId_idx`;
