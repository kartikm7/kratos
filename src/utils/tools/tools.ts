import { tool } from "ai";
import { z } from "zod/v4";
import puppeteer from "puppeteer-extra";
import stealth from "puppeteer-extra-plugin-stealth";
import TurndownService from "turndown";
import { CHAT_MODES, type ChatModes } from "../constants";
import { WriteToGlobalMemory } from "./knowledgeBase/knowledgeBaseTool";
import { OnlyReadBashTools, ReadWriteBashTools } from "../..";

// TODO: There's a lightweight browser, built just for this if we can migrate to that easily it will make life a whole lot better
const turndownService = new TurndownService();
turndownService.remove(["script", "meta", "del", "style"]);

const WebBrowserTool = tool({
  title: "WebBrowser",
  description: "Scrape from any website, this launches playwright and returns the requested url page in markdown format",
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
  readWriteBash.title = "Bash"
  const { writeFile } = ReadWriteBashTools
  const onlyReadbash = OnlyReadBashTools.bash
  onlyReadbash.title = "ReadOnlyBash"
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
  WebBrowserTool,
  getModeSpecificTools,
};
