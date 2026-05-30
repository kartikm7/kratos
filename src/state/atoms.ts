import { atom } from "jotai";
import {
  type ConnectedProvidersList,
  type Model,
  type ModelsList,
} from "./types";

export const llmAtom = atom<any>(); // need to figure a generic type for this
// TODO: Most likely string is not the right type, when I start adding tools this will most likely cause a problem
export const streamAtom = atom<string>("");
export const selectedModelAtom = atom<Model>();
export const modelsListAtom = atom<ModelsList | null>(null);
export const connectedProvidersAtom = atom<ConnectedProvidersList>();
