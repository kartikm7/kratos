import { tool } from "ai";
import { z } from "zod/v4";
import { writeMemoryToFile } from "./fileBasedMemory.ts";
import path from "path";
import { AppDirectory } from "../../os.ts";

const MemoriesDirectory = path.join(AppDirectory, "Memories");
export const WriteToGlobalMemory = tool({
  description: `Global knowledge-base, store user solved (i.e actually implemented) patterns. It's just a directory with Markdown files.
This tool can be used to write a file to the knowledge-base directory. This directory can be used to validate if the user has solved a pattern before or not. 
Directory: ${MemoriesDirectory}
`,
  inputSchema: z.object({ title: z.string(), content: z.string() }),
  execute: async ({ title, content }) => {
    writeMemoryToFile(title, content);
  },
});
