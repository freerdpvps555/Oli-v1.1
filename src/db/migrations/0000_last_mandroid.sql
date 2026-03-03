CREATE TABLE `admin_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`full_name` text NOT NULL,
	`email` text,
	`avatar` text,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `oil_prices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`market` text NOT NULL,
	`price` real NOT NULL,
	`change` real NOT NULL,
	`change_percent` real NOT NULL,
	`high_24h` real NOT NULL,
	`low_24h` real NOT NULL,
	`volume` real,
	`recorded_at` integer
);
--> statement-breakpoint
CREATE TABLE `price_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`market` text NOT NULL,
	`price` real NOT NULL,
	`timestamp` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);