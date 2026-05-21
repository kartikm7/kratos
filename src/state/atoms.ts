import type { Provider } from "ai";
import { atom } from "jotai";
import type { ModelsList } from "./types";

export const llmAtom = atom<Provider>()
export const modelsListAtom = atom<ModelsList | null>() 
