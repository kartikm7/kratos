export default [
    {
        "name": "20261018145733_tiny_arachne",
        "timestamp": 1792335453000,
        "sql": "CREATE TABLE `chats_table` (\r\n\t`id` integer PRIMARY KEY AUTOINCREMENT,\r\n\t`title` text NOT NULL\r\n);\r\n--> statement-breakpoint\r\nCREATE TABLE `messages_table` (\r\n\t`id` integer PRIMARY KEY AUTOINCREMENT,\r\n\t`role` text NOT NULL,\r\n\t`content` text NOT NULL,\r\n\t`chat_id` integer,\r\n\tCONSTRAINT `fk_messages_table_chat_id_chats_table_id_fk` FOREIGN KEY (`chat_id`) REFERENCES `chats_table`(`id`)\r\n);\r\n"
    },
    {
        "name": "20261018151048_short_changeling",
        "timestamp": 1792336248000,
        "sql": "ALTER TABLE `messages_table` RENAME COLUMN `content` TO `parts`;"
    },
    {
        "name": "20261018183623_lyrical_masked_marvel",
        "timestamp": 1792348583000,
        "sql": "ALTER TABLE `chats_table` ADD `path` text NOT NULL;"
    },
    {
        "name": "20261018184550_volatile_katie_power",
        "timestamp": 1792349150000,
        "sql": "ALTER TABLE `chats_table` ADD `created_at` text DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint\r\nALTER TABLE `chats_table` ADD `updated_at` text DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint\r\nALTER TABLE `messages_table` ADD `created_at` text DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint\r\nALTER TABLE `messages_table` ADD `updated_at` text DEFAULT (CURRENT_TIMESTAMP);"
    },
    {
        "name": "20261018184938_cynical_sally_floyd",
        "timestamp": 1792349378000,
        "sql": "ALTER TABLE `chats_table` RENAME COLUMN `created_at` TO `createdAt`;--> statement-breakpoint\r\nALTER TABLE `chats_table` RENAME COLUMN `updated_at` TO `updatedAt`;--> statement-breakpoint\r\nALTER TABLE `messages_table` RENAME COLUMN `created_at` TO `createdAt`;--> statement-breakpoint\r\nALTER TABLE `messages_table` RENAME COLUMN `updated_at` TO `updatedAt`;"
    }
]