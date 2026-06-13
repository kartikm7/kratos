import { tool } from "ai";
import { z } from "zod/v4";
import { Bash, OverlayFs } from "just-bash";
import { createBashTool } from "bash-tool";
import puppeteer from "puppeteer-extra";
import stealth from "puppeteer-extra-plugin-stealth";
import TurndownService from "turndown";
import { replaceInFile } from "replace-in-file";
import { readFile, writeFile, exists } from "fs/promises";
// import puppeteer from "puppeteer";

// TODO: should add a buffered reader, since large codebases tend to have files with > 500 lines of code making this too large
// could also be that the llm fallsback to sandboxed bash to read the files using grep and shit
const ReadFile = tool({
  description: "Read the contents of a file",
  inputSchema: z.object({ path: z.string() }),
  execute: async ({ path }) => {
    try {
      const contents = await readFile(path, { encoding: "utf-8" });
      return contents;
    } catch (error) {
      return error;
    }
  },
});

const WriteFile = tool({
  description: "Write a new file to a desired path",
  inputSchema: z.object({ path: z.string(), contents: z.string() }),
  execute: async ({ path, contents }) => {
    try {
      if (await exists(path))
        throw new Error("A file of this name already exists");
      await writeFile(path, contents);
      return { success: true }; // how times fly, need to return a value that the llm needs to understand ffs
    } catch (error) {
      return error;
    }
  },
});

const EditFile = tool({
  description: "Replace in file, replace exact first occurence",
  inputSchema: z.object({
    file: z.string(),
    from: z.string(),
    to: z.string(),
  }),
  execute: async ({ file, from, to }) => {
    const options = { files: file, from, to };
    try {
      const results = await replaceInFile(options);
      return results;
    } catch (e) {
      return String(e);
    }
  },
});

const SandboxBashTools = async () => {
  const overlayFs = new OverlayFs({
    root: process.cwd(),
    mountPoint: "/workspace",
  });
  const sandboxBash = new Bash({
    fs: overlayFs,
    cwd: "/workspace",
  });
  const { tools } = await createBashTool({
    sandbox: sandboxBash,
    destination: "/workspace",
    extraInstructions: `You have access to files and directories mounted at /workspace (Sandboxed Directory, Sandboxing is only for Bash Commands).
Use bash commands to explore:
- ls /workspace to see the directory structure
- cat /workspace/filename to read files
- grep -r "pattern" /workspace to search content
- find /workspace -name "*.ext" to find files by pattern
- head, tail, wc, sort, uniq for data analysis

Help the user explore, search, and understand the contents.`,
  });

  const { bash } = tools;
  return bash;
};

// TODO: There's a lightweight browser, built just for this if we can migrate to that easily it will make life a whole lot better
const turndownService = new TurndownService();
turndownService.remove(["script", "meta", "del", "style"]);

const WebBrowserTool = tool({
  description:
    "Scrape from any website, this launches playwright and returns the requested url page in markdown format",
  inputSchema: z.object({ url: z.string() }),
  execute: async ({ url }) => {
    puppeteer.use(stealth());
    const browser = await puppeteer.launch({ headless: "shell" });
    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "domcontentloaded" }); // this travels to the page
      const content = await page.content();
      const markdown = turndownService.turndown(content);
      return markdown;
    } finally {
      // need to cleanup otherwise this will devour memory
      browser.close();
    }
  },
});

export { ReadFile, WriteFile, EditFile, SandboxBashTools, WebBrowserTool };
