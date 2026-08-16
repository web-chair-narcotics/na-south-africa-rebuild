CREATE TABLE `contentPages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`areaId` int,
	`slug` varchar(180) NOT NULL,
	`title` varchar(255) NOT NULL,
	`excerpt` text,
	`body` text NOT NULL,
	`status` enum('draft','submitted','published','archived') NOT NULL DEFAULT 'draft',
	`createdByUserId` int,
	`reviewedByUserId` int,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contentPages_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_pages_area_slug_unique` UNIQUE(`areaId`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recipientUserId` int NOT NULL,
	`areaId` int,
	`kind` varchar(80) NOT NULL,
	`title` varchar(255) NOT NULL,
	`body` text NOT NULL,
	`entityType` varchar(80),
	`entityId` int,
	`readAt` timestamp,
	`emailDeliveryStatus` enum('not_configured','queued','sent','failed') NOT NULL DEFAULT 'not_configured',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `content_pages_status_idx` ON `contentPages` (`status`);--> statement-breakpoint
CREATE INDEX `notifications_recipient_read_idx` ON `notifications` (`recipientUserId`,`readAt`);