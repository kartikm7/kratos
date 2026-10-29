import { AppDirectory } from "./os";
import path from "path";

export const MAX_TOOLS_TOKEN = 10000;
export const DEFAULT_AGENT_STEP_COUNT = 100; // this should be sufficient I believe, can always increase this
export const LOCAL_PROVIDER = "local"; // stupid but intuitive
export const GET_LOCAL_MODEL_ENDPOINT = "models";
export const CHAT_MODES = ["build", "discuss", "court"];
export type ChatModes = "build" | "discuss" | "court";
export const MAX_TOAST_TEXT_LENGTH = 40;

// Some common paths
export const MemoriesPath = path.join(AppDirectory, "Memories");
export const SandboxMemoriesPath = "/.kratos/Memories";

// this includes file: prefix
export const DatabaseFilePath = path.join(AppDirectory, "chats.db");
export const CurrentWorkingDirectory = process.cwd();

// Supported providers
// TODO: This is low-key tech-debt if we can find a better for the bun-compiler to bundle the packages, then it'll be sorted
export const Providers = {
  "@ai-sdk/google": () => import("@ai-sdk/google"),
  "@ai-sdk/groq": () => import("@ai-sdk/groq"),
  "@ai-sdk/mistral": () => import("@ai-sdk/mistral"),
  "@ai-sdk/openai-compatible": () => import("@ai-sdk/openai-compatible"),
};
