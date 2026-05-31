import { tool } from "ai";
import { z } from "zod/v4";
import { Bash, OverlayFs } from "just-bash";
import { createBashTool } from "bash-tool";
import { chromium } from "playwright";
// import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";
import TurndownService from "turndown";

const SandboxBashTools = async () => {
  const overlayFs = new OverlayFs({
    root: process.cwd(),
    mountPoint: "/workspace",
    readOnly: true,
  });
  const bash = new Bash({
    fs: overlayFs,
    cwd: "/workspace",
  });
  const { tools } = await createBashTool({
    sandbox: bash,
    destination: "/workspace",
    extraInstructions: `You have access to files and directories mounted at /workspace.
Use bash commands to explore:
- ls /workspace to see the directory structure
- cat /workspace/filename to read files
- grep -r "pattern" /workspace to search content
- find /workspace -name "*.ext" to find files by pattern
- head, tail, wc, sort, uniq for data analysis

Help the user explore, search, and understand the contents.`,
  });

  return tools;
};

// TODO: There's a lightweight browser, built just for this if we can migrate to that easily it will make life a whole lot better
const turndownService = new TurndownService();
const WebBrowserTool = tool({
  description:
    "Scrape from any website, this launches playwright and returns the requested url page in markdown format",
  inputSchema: z.object({ url: z.string() }),
  execute: async ({ url }) => {
    // chromium.use(stealth()); // bot detection evasion
    const browser = await chromium.launch({ headless: true });
    try {
      const context = await browser.newContext();
      const page = await context.newPage();
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

export { SandboxBashTools, WebBrowserTool };
