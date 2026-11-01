import { drizzle } from "drizzle-orm/bun-sqlite";
import { DatabaseFilePath } from "../utils/constants";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import Database from "bun:sqlite";

const sqlite = new Database(DatabaseFilePath);
export const db = drizzle({ client: sqlite });
migrate(db, { migrationsFolder: "./drizzle" });
