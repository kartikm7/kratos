ALTER TABLE `chats_table` ADD `created_at` text DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `chats_table` ADD `updated_at` text DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `messages_table` ADD `created_at` text DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `messages_table` ADD `updated_at` text DEFAULT (CURRENT_TIMESTAMP);