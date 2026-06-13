import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import { AppDirectory } from "../../os";
import fs from "fs";

const location = path.join(AppDirectory, "knowledgebase.db");
const init = async () => {
  if (exists()) return;
  const db = new Database(location);
  db.exec(` CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
  db.close();
};

const query = async (query: string) => {
  if (!exists()) init();
  const sqlite = new Database(location);
  const db = drizzle({ client: sqlite });
  const result = db.run(query);
  return result;
};

const exists = () => {
  return fs.existsSync(location);
};

export { query };
