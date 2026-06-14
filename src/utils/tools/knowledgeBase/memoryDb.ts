import path from "path";
import { AppDirectory } from "../../os";
import fs from "fs";
import Database from "libsql";
import { drizzle } from "drizzle-orm/libsql";

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
  const db = drizzle("file:" + location); // learned something new with the "file:" prefix
  const result = await db.run(query);
  return JSON.stringify(result);
};

const exists = () => {
  return fs.existsSync(location);
};

export { query };
