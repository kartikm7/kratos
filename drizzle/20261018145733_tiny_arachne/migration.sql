CREATE TABLE `chats_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `messages_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`chat_id` integer,
	CONSTRAINT `fk_messages_table_chat_id_chats_table_id_fk` FOREIGN KEY (`chat_id`) REFERENCES `chats_table`(`id`)
);
