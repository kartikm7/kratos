import { tool } from "ai";
import { z } from "zod/v4";
// import { query as run } from "./memoryDb.ts";
import { writeMemoryToFile } from "./fileBasedMemory.ts";
import path from "path"
import { AppDirectory } from "../../os.ts";

// export const KnowledgeBaseTool = tool({
//   description: `Global knowledge-base, used to store user solved (i.e actually implemented) patterns. It's a SQLiteDB. 
//     You can use it to view what the user has done and you can also add what the user knows. It's important you add what the user knows as when a task is solved. 
// Before adding, verify if a similar entry already exists or not.`,
//   inputSchema: z.object({ query: z.string() }),
//   execute: async ({ query }) => {
//     const results = run(query);
//     return results;
//   },
// });


const MemoriesDirectory = path.join(AppDirectory, "Memories");
export const WriteToGlobalMemory = tool({
  description:
    `Global knowledge-base, store user solved (i.e actually implemented) patterns. It's just a directory with Markdown files.
This tool can be used to write a file to the knowledge-base directory. This directory can be used to validate if the user has solved a pattern before or not. 
Directory: ${MemoriesDirectory}
`,
  inputSchema: z.object({ title: z.string(), content: z.string() }),
  execute: async ({ title, content }) => {
    writeMemoryToFile(title, content)
  },
});
