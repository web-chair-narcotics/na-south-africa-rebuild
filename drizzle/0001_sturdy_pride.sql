CREATE TABLE `areas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(80) NOT NULL,
	`name` varchar(160) NOT NULL,
	`province` varchar(120),
	`publicDescription` text,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `areas_id` PRIMARY KEY(`id`),
	CONSTRAINT `areas_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `auditEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`actorUserId` int,
	`areaId` int,
	`entityType` varchar(80) NOT NULL,
	`entityId` int NOT NULL,
	`action` varchar(120) NOT NULL,
	`detail` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meetings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`areaId` int NOT NULL,
	`meetingName` varchar(255) NOT NULL,
	`venueName` varchar(255),
	`streetAddress` varchar(255),
	`suburb` varchar(160),
	`city` varchar(160),
	`province` varchar(120),
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`daysOfWeek` text NOT NULL,
	`startTime` varchar(5) NOT NULL,
	`meetingType` varchar(100) NOT NULL,
	`meetingFormat` enum('in_person','online','hybrid') NOT NULL DEFAULT 'in_person',
	`contactPerson` varchar(160),
	`phone` varchar(64),
	`specialNotes` text,
	`onlineUrl` varchar(1024),
	`status` enum('draft','submitted','changes_requested','published','archived') NOT NULL DEFAULT 'draft',
	`sourceUrl` varchar(1024),
	`sourceNote` text,
	`geocodeFormattedAddress` varchar(512),
	`geocodePlaceId` varchar(255),
	`addressVerified` boolean NOT NULL DEFAULT false,
	`mapPinConfirmed` boolean NOT NULL DEFAULT false,
	`spellingChecked` boolean NOT NULL DEFAULT false,
	`contactConfirmed` boolean NOT NULL DEFAULT false,
	`reviewNotes` text,
	`reviewedByUserId` int,
	`reviewedAt` timestamp,
	`revision` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `meetings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userAreas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`areaId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userAreas_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_areas_user_area_unique` UNIQUE(`userId`,`areaId`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','area_admin','admin') NOT NULL DEFAULT 'user';--> statement-breakpoint
CREATE INDEX `audit_events_entity_idx` ON `auditEvents` (`entityType`,`entityId`);--> statement-breakpoint
CREATE INDEX `meetings_area_status_idx` ON `meetings` (`areaId`,`status`);--> statement-breakpoint
CREATE INDEX `meetings_status_time_idx` ON `meetings` (`status`,`startTime`);--> statement-breakpoint
CREATE INDEX `meetings_type_idx` ON `meetings` (`meetingType`);--> statement-breakpoint
CREATE INDEX `user_areas_user_idx` ON `userAreas` (`userId`);--> statement-breakpoint
CREATE INDEX `user_areas_area_idx` ON `userAreas` (`areaId`);