import type { UIDataTypes, UIMessagePart, UITools } from "ai";
import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const chatsTable = sqliteTable("chats_table", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  path: text().notNull(), // this is needed
  createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text().default(sql`(CURRENT_TIMESTAMP)`),
});

export const messagesTable = sqliteTable("messages_table", {
  id: int().primaryKey({ autoIncrement: true }),
  role: text().$type<"system" | "user" | "assistant">().notNull(),
  parts: text("parts", { mode: "json" })
    .$type<UIMessagePart<UIDataTypes, UITools>[]>()
    .notNull(),
  chatId: int("chat_id").references(() => chatsTable.id),
  createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text().default(sql`(CURRENT_TIMESTAMP)`),
});
