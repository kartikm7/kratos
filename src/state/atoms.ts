import { atom } from "jotai";
import {
  type ConnectedProvidersList,
  type MessageStream,
  type Model,
  type ModelsList,
} from "./types";
import {
  ReadFile,
  EditFile,
  WriteFile,
  WebBrowserTool,
  getModeSpecificTools,
} from "../utils/tools/tools";
import { KnowledgeBaseTool } from "../utils/tools/knowledgeBase/knowledgeBaseTool";
import { ShellTool } from "../utils/tools/shellTool/shellTool";
import type { Theme } from "../themes/types";
import kratosTheme from "../themes/variants/kratos.json" with { type: "json" };
import type { ChatModes } from "../utils/constants";
import type { ModelMessage } from "ai";

export const llmAtom = atom<any>(); // need to figure a generic type for this
// TODO: Most likely string is not the right type, when I start adding tools this will most likely cause a problem
export const streamAtom = atom<MessageStream>([]);
export const selectedModelAtom = atom<Model>();
export const modelsListAtom = atom<ModelsList | null>(null);
export const connectedProvidersAtom = atom<ConnectedProvidersList>();
export const themeAtom = atom<Theme>(kratosTheme);
export const collapseAtom = atom<boolean>(true);
export const chatModeAtom = atom<ChatModes>("build"); // court mode will be fun as fuck

// maintains current chat
export const messagesAtom = atom<ModelMessage[]>([])

// the required tools
export const toolsAtom = atom(getModeSpecificTools("build"));
