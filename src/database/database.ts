import { drizzle } from "drizzle-orm/better-sqlite3";
import { DatabaseFilePath } from "../utils/constants";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import { makeAppDir } from "../utils/os";

makeAppDir(); // db file lives in AppDirectory, which may not exist on first run
const sqlite = new Database(DatabaseFilePath);
export const db = drizzle({ client: sqlite });
migrate(db, { migrationsFolder: "./drizzle" });
