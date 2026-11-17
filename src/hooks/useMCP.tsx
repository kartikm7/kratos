import { readMcpConfig } from "../utils/mcp"
import { createMCPClient } from '@ai-sdk/mcp';
import { StdioMCPTransport as StdioClientTransport } from '@ai-sdk/mcp/mcp-stdio';
import { useSetAtom } from "jotai";
import { mcpToolsAtom } from "../state/atoms";

export const useMCP = () => {
  const setMCPTools = useSetAtom(mcpToolsAtom)
  const loadTools = async () => {
    let tools = {}
    const config = readMcpConfig()
    if (!config) {
      setMCPTools({})
      return
    }
    for (let key in config) {
      const info = config[key]
      const server = await createMCPClient({
        clientName: info?.name,
        transport: info?.type === "remote" ? {
          type: "http",
          url: info.url
        } : new StdioClientTransport({
          command: info?.command || "",
          args: info?.args,
        })
      })
      tools = { ...(await server.tools()), ...tools }
    }
    console.log(tools)
    // update mcp tools
    setMCPTools(tools)
  }

  return { loadTools }
}
