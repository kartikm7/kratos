import { tool } from "ai";
import { z } from "zod/v4";
import TurndownService from "turndown";
import { CHAT_MODES, type ChatModes } from "../constants";
import { WriteToGlobalMemory } from "./knowledgeBase/knowledgeBaseTool";
import { OnlyReadBashTools, ReadWriteBashTools } from "../..";

// TODO: There's a lightweight browser, built just for this if we can migrate to that easily it will make life a whole lot better
const turndownService = new TurndownService();
turndownService.remove(["script", "meta", "del", "style"]);

const WebBrowserTool = tool({
  title: "WebBrowser",
  description:
    "Scrape from any website, this launches a headless chrome and returns the requested url page in markdown format",
  inputSchema: z.object({ url: z.string() }),
  execute: async ({ url }) => {
    await using view = new Bun.WebView({
      backend: {
        type: "chrome",
        argv: ["--headless=new", "--window-size=1920,1080"],
      },
    });
    await view.navigate("about:blank");
    await view.cdp("Emulation.setUserAgentOverride", {
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36",
    });
    await view.navigate(url);
    const html = (await view.evaluate(
      "document.documentElement.innerHTML",
    )) as string; // let's assume this to be string always
    const markdown = turndownService.turndown(html);
    return markdown;
  },
});

const getModeSpecificTools = (mode: ChatModes) => {
  const readWriteBash = ReadWriteBashTools.bash;
  readWriteBash.title = "Bash";
  const { readFile, writeFile } = ReadWriteBashTools;
  const onlyReadbash = OnlyReadBashTools.bash;
  onlyReadbash.title = "ReadOnlyBash";
  // commented this out, because it was not working as expected.
  // but, it could be a security hazard since RWFS which is currently being used has access to Writing to the user Fs
  // although readFile should only read the file, but still haha.
  // const { readFile } = OnlyReadBashTools
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

export { WebBrowserTool, getModeSpecificTools };
