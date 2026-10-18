import type { UIMessage } from "@ai-sdk/react";
import { useAtom } from "jotai";
import { chatIdAtom } from "../state/atoms";
import { db } from "../database/database";
import { chatsTable, messagesTable } from "../database/schema";
import { eq } from "drizzle-orm";

export const useDb = () => {
  const [chatId, setChatId] = useAtom(chatIdAtom);

  const init = async () => {
    let lastInsertRowid = Number(chatId);
    if (!chatId) {
      const result = await db
        .insert(chatsTable)
        .values({ title: crypto.randomUUID() }); // TODO: Generate a Title based on the chat
      lastInsertRowid = Number(result.lastInsertRowid);
      setChatId(Number(lastInsertRowid));
    }
    return lastInsertRowid;
  };

  const appendToChat = async (message: UIMessage) => {
    try {
      const lastInsertRowid = await init();
      const row: typeof messagesTable.$inferInsert = {
        role: message.role,
        parts: message.parts,
        chatId: Number(lastInsertRowid),
      };
      const res = await db.insert(messagesTable).values(row);
      console.log("[DB] Message saved successfully", res.lastInsertRowid);
    } catch (e: any) {
      console.error("[DB] Failure:", e.cause?.message ?? e.cause);
    }
  };

  const getChatIds = async () => {
    try {
      const res = await db.select().from(chatsTable);
      return res;
    } catch (e: any) {
      console.error("[DB] Failure:", e.cause?.message ?? e.cause);
    }

    return [];
  };

  const getChat = async (chatId: number) => {
    try {
      if (!chatId) throw new Error("Empty chat ID is not accepted");
      const res = await db
        .select()
        .from(messagesTable)
        .where(eq(messagesTable.chatId, chatId));
      return res;
    } catch (e: any) {
      console.error("[DB] Failure:", e.cause?.message ?? e.cause ?? e);
    }
    return [];
  };

  return { appendToChat, getChatIds, getChat };
};
