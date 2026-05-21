import type { Provider } from "ai";
import { atom } from "jotai";
import type { ModelsList } from "./types";
import { fetchAndCacheModels } from "../utils/models";

export const llmAtom = atom<Provider>()
export const modelsListAtom = atom<ModelsList | null>(JSON.parse(await fetchAndCacheModels() || "") as ModelsList) // making the API call here not sure if it's right or wrong, but I'm happy building this!
