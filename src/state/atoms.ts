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
} from "../utils/tools/tools";
import { KnowledgeBaseTool } from "../utils/tools/knowledgeBase/knowledgeBaseTool";
import { ShellTool } from "../utils/tools/shellTool/shellTool";

export const llmAtom = atom<any>(); // need to figure a generic type for this
// TODO: Most likely string is not the right type, when I start adding tools this will most likely cause a problem
export const streamAtom = atom<MessageStream>([]);
export const selectedModelAtom = atom<Model>();
export const modelsListAtom = atom<ModelsList | null>(null);
export const connectedProvidersAtom = atom<ConnectedProvidersList>();

export const toolsAtom = atom({
  ShellTool,
  WebBrowserTool,
  ReadFile,
  WriteFile,
  EditFile,
  KnowledgeBaseTool,
});
