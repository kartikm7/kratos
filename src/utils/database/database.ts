import path from "path";
import { AppDirectory } from "../os";
import { drizzle } from "drizzle-orm/libsql";

const location = path.join(AppDirectory, "sessions.db");

export const db = drizzle("file:" + location); // learned something new with the "file:" prefix
