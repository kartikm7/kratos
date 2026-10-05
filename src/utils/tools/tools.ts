import { tool } from "ai";
import { z } from "zod/v4";
import puppeteer from "puppeteer-extra";
import stealth from "puppeteer-extra-plugin-stealth";
import TurndownService from "turndown";
import { replaceInFile } from "replace-in-file";
import { readFile, writeFile, exists } from "fs/promises";
import { CHAT_MODES, type ChatModes } from "../constants";
import { WriteToGlobalMemory } from "./knowledgeBase/knowledgeBaseTool";
import { OnlyReadBashTools, ReadWriteBashTools } from "../..";
// import puppeteer from "puppeteer";

// TODO: should add a buffered reader, since large codebases tend to have files with > 500 lines of code making this too large
// could also be that the llm fallsback to sandboxed bash to read the files using grep and shit
const ReadFile = tool({
  description: "Read the contents of a file",
  inputSchema: z.object({ path: z.string() }),
  execute: async ({ path }) => {
    const contents = await readFile(path, { encoding: "utf-8" });
    return String(contents);
  },
});

const WriteFile = tool({
  description: "Write a new file to a desired path",
  inputSchema: z.object({ path: z.string(), contents: z.string() }),
  execute: async ({ path, contents }) => {
    if (await exists(path))
      throw new Error("A file of this name already exists");
    await writeFile(path, contents);
    return { success: true }; // how times fly, need to return a value that the llm needs to understand ffs
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

const getModeSpecificTools = (mode: ChatModes) => {
  const readWriteBash = ReadWriteBashTools.bash
  const { writeFile } = ReadWriteBashTools
  const onlyReadbash = OnlyReadBashTools.bash
  const { readFile } = OnlyReadBashTools
  if (!CHAT_MODES.includes(mode)) return {}; // early return
  switch (mode) {
    case "build":
      return {
        readWriteBash,
        readFile,
        writeFile,
        WebBrowserTool,
        WriteToGlobalMemory,
      };
    case "discuss":
      return {
        onlyReadbash,
        readFile,
        WebBrowserTool,
        WriteToGlobalMemory,
      };
    case "court":
      return {
        onlyReadbash,
        readFile,
        WebBrowserTool,
        WriteToGlobalMemory,
      };
    default:
      break;
  }
};

export {
  ReadFile,
  WriteFile,
  EditFile,
  WebBrowserTool,
  getModeSpecificTools,
};
