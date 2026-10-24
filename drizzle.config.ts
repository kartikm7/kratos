import { defineConfig } from "drizzle-kit";
import { DatabaseFilePath } from "./src/utils/constants";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/database/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: DatabaseFilePath,
  },
});
