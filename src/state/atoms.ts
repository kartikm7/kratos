import { atom } from "jotai";
import {
  type ConnectedProvidersList,
  type MessageStream,
  type Model,
  type ModelsList,
  type Preferences,
  type Toast,
} from "./types";
import type { Theme } from "../themes/types";
import kratosTheme from "../themes/variants/kratos.json" with { type: "json" };
import type { ChatModes } from "../utils/constants";
import { createModel } from "../utils/models";
import { readPreferences } from "../utils/preferences";
import { readAuth } from "../utils/auth";

const connectedProviders = readAuth();
const preferences = readPreferences();
console.log(preferences)

// creating model
const model = createModel(preferences.selectedModel as Model | undefined, connectedProviders || {});
export const llmAtom = atom<any>(model); // need to figure a generic type for this
// TODO: Most likely string is not the right type, when I start adding tools this will most likely cause a problem
export const preferencesAtom = atom<Preferences>(preferences);
export const modelsListAtom = atom<ModelsList | null>(null);
export const connectedProvidersAtom = atom<ConnectedProvidersList>();
export const themeAtom = atom<Theme>(kratosTheme);
export const collapseAtom = atom<boolean>(true);
export const chatModeAtom = atom<ChatModes>("build"); // court mode will be fun as fuck

export const toastAtom = atom<Toast>(null);

// current chat id
export const chatIdAtom = atom<number | undefined>();
