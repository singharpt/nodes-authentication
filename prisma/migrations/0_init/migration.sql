-- CreateTable
CREATE TABLE `users_data` (
    `email` VARCHAR(50) NOT NULL,
    `password` VARCHAR(20) NOT NULL,
    `admin` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

