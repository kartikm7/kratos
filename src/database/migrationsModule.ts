import { readMigrationFiles } from "drizzle-orm/migrator";
import path from "path";

const migrations = readMigrationFiles({ migrationsFolder: "./drizzle" });

const journal = migrations.map((m) => ({
  name: (m as any).name,
  timestamp: m.folderMillis,
  sql: m.sql.join("--> statement-breakpoint"),
}));

await Bun.write(
  path.join(import.meta.dirname, "generated-migrations.ts"),
  `export default ${JSON.stringify(journal, null, 4)}`,
);
