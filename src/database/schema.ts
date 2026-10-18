import type { UIDataTypes, UIMessagePart, UITools } from "ai";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const chatsTable = sqliteTable("chats_table", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
});

export const messagesTable = sqliteTable("messages_table", {
  id: int().primaryKey({ autoIncrement: true }),
  role: text().notNull(),
  parts: text("parts", { mode: "json" })
    .$type<UIMessagePart<UIDataTypes, UITools>[]>()
    .notNull(),
  chatId: int("chat_id").references(() => chatsTable.id),
});
