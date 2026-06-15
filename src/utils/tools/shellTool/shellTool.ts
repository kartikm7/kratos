import { tool } from "ai";
import shell from "shelljs";
import { z } from "zod/v4";
import { MAX_TOOLS_TOKEN } from "../../constants";

// ls, find, grep, mkdir, cat
export const ShellTool = tool({
  description:
    "Execute basic shell commands. ls, find, grep, mkdir and cat are only supported.",
  inputExamples: [{ input: { cmd: "ls", flags: "-R", paths: [""] } }],
  inputSchema: z.object({
    cmd: z.string().meta({
      description:
        "only these commands are supports ls, find, grep, mkdir, cat",
    }),
    flags: z.string().optional(),
    regex: z
      .string()
      .optional()
      .meta({ description: "use this only for grep" }),
    paths: z.array(z.string()),
  }),
  execute: async ({ cmd, flags = "", regex = "", paths }) => {
    let result: any;
    switch (cmd) {
      case "ls":
        result = !!flags ? shell.ls(flags, paths) : shell.ls(paths); // this is sleezy, but need to do this
        break;
      case "find":
        result = shell.find(paths);
        break;
      case "grep":
        result = shell.grep(regex, paths);
        break;
      case "mkdir":
        result = shell.mkdir(flags, paths);
        break;
      case "cat":
        result = shell.cat(paths);
        break;
      default:
        break;
    }
    result = JSON.stringify(result.stdout);
    const tokensInCharacters = Math.abs(MAX_TOOLS_TOKEN / 4); // 4 characters is roughly 1 token
    result =
      result.length > tokensInCharacters
        ? result.slice(0, tokensInCharacters) + "..."
        : result;
    return result;
  },
});
