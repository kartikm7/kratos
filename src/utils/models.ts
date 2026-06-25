import axios from "axios";
import path from "path";
import fs from "fs";
import { AppDirectory, makeAppDir } from "./os";
import type { ConnectedProvidersList, ModelsList } from "../state/types";
import { OLLAMA_PROVIDER, ollamaModelsList } from "./ollama";

const location = path.join(AppDirectory, "models.json");

async function getModels() {
  const response = await axios.get("https://models.dev/api.json");
  return JSON.stringify(response.data);
}

function cacheModels(data: string) {
  makeAppDir();
  console.log("Caching model information at ", location);
  fs.writeFileSync(location, JSON.stringify(data));
}

function modelsCached(): boolean {
  return fs.existsSync(location);
}

function cachedModels() {
  if (modelsCached())
    return fs.readFileSync(location, { encoding: "utf8", flag: "r" });
}

async function fetchAndCacheModels(forceRefresh = false) {
  if (modelsCached() && !forceRefresh) return cachedModels();
  console.log("Fetching models and Caching");
  const models = await getModels();
  cacheModels(models);
  return models;
}

const parseModelsList = (rawModels: string) => {
  const parsed = JSON.parse(rawModels) as ModelsList | string;
  return typeof parsed === "string"
    ? (JSON.parse(parsed) as ModelsList)
    : parsed;
};

const hydrateLocalModels = async (
  baseModels: ModelsList,
  connectedProviders?: ConnectedProvidersList,
) => {
  const hydratedModels = { ...baseModels };
  const ollamaConnection = connectedProviders?.[OLLAMA_PROVIDER];

  if (ollamaConnection?.type === "local") {
    try {
      const ollamaModels = await ollamaModelsList(ollamaConnection.baseUrl);
      Object.assign(hydratedModels, ollamaModels);
    } catch (error) {
      console.log("Could not hydrate Ollama models", error);
    }
  } else {
    delete hydratedModels[OLLAMA_PROVIDER];
  }

  return hydratedModels;
};

export {
  getModels,
  cacheModels,
  modelsCached,
  cachedModels,
  fetchAndCacheModels,
  parseModelsList,
  hydrateLocalModels,
};
