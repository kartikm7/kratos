import fs from "fs";
import path from "path";
import { AppDirectory, makeAppDir } from "./os";
import type { McpServerConfig, McpServersList } from "../state/types";

const location = path.join(AppDirectory, "mcp.json");

const readMcpConfig = (): McpServersList => {
  if (!fs.existsSync(location)) return {};
  const data = fs.readFileSync(location, { encoding: "utf8", flag: "r" });
  if (!data) return {};
  return JSON.parse(data) as McpServersList;
};

const upsertMcpServer = (server: McpServerConfig): McpServersList => {
  const previousData = readMcpConfig();
  makeAppDir();
  const nextData = {
    ...previousData,
    [server.name]: server,
  };
  fs.writeFileSync(location, JSON.stringify(nextData));
  return nextData;
};

const removeMcpServer = (name: string): McpServersList => {
  const previousData = readMcpConfig();
  const nextData = { ...previousData };
  delete nextData[name];
  fs.writeFileSync(location, JSON.stringify(nextData));
  return nextData;
};

export { readMcpConfig, upsertMcpServer, removeMcpServer };
