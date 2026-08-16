CREATE TABLE `emergencyNotices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`severity` enum('info','urgent') NOT NULL DEFAULT 'info',
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`startsAt` timestamp NOT NULL,
	`endsAt` timestamp,
	`createdByUserId` int NOT NULL,
	`reviewedByUserId` int,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emergencyNotices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `emergency_notices_status_window_idx` ON `emergencyNotices` (`status`,`startsAt`,`endsAt`);