import { drizzle } from "drizzle-orm/libsql";
import { DatabaseFilePath } from "../utils/constants";
import { migrate } from "drizzle-orm/libsql/migrator";

export const db = drizzle(DatabaseFilePath);
await migrate(db, { migrationsFolder: "./drizzle" });
