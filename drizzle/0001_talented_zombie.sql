CREATE TABLE `applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`gamertag` varchar(255) NOT NULL,
	`xboxAccountId` varchar(255) NOT NULL,
	`reason` text NOT NULL,
	`aerternosUsername` varchar(255),
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `applications_id` PRIMARY KEY(`id`)
);
