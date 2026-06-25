import axios from "axios";
import path from "path";
import fs from "fs";
import { AppDirectory, makeAppDir } from "./os";
import type {
  ApiConnectedProvider,
  ConnectedProvidersList,
  LocalConnectedProvider,
  Model,
} from "../state/types";
import { toast } from "@opentui-ui/toast/react";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { LOCAL_MODEL, LOCAL_PROVIDER } from "./constants";

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

async function createModel(
  selectedModel: Model,
  connectedProviders: ConnectedProvidersList,
) {
  console.log(selectedModel);
  // basic input validation
  if (!connectedProviders) {
    toast.error("Connected providers is empty");
    return;
  }

  // incase its a local model
  if (selectedModel.name == LOCAL_MODEL) {
    const auth = connectedProviders[LOCAL_PROVIDER] as LocalConnectedProvider; // only one endpoint at this point (users using multiple got to be lesser)
    if (!auth?.baseUrl) {
      toast.error("Local provider base url missing (use /connect)");
      return;
    }
    console.log(auth);
    return createOpenAICompatible({
      name: LOCAL_MODEL,
      baseURL: "http://127.0.0.1:8080/v1",
      includeUsage: true,
    });
  }

  // api based model
  const pkg = await import(`${selectedModel.providerInfo?.npm}`);
  if (!pkg) {
    toast.error("Could not import model package");
    return;
  }
  const providerName = selectedModel.providerInfo?.name || "";
  if (!providerName) {
    toast.error("Provider name is missing");
    return;
  }

  const mostlyFunctionName = `create${providerName[0]?.toUpperCase() + providerName.slice(1)}`;
  let createModel = pkg[mostlyFunctionName];
  if (!createModel) {
    // dynamically finding
    const dynamicModuleName = Object.keys(pkg).find((val) =>
      val.includes(mostlyFunctionName),
    );
    createModel = pkg[dynamicModuleName || ""];
  }
  const auth = connectedProviders[providerName] as ApiConnectedProvider;
  const model = createModel({ apiKey: auth?.key || "" });
  return model;
}

export {
  getModels,
  cacheModels,
  modelsCached,
  cachedModels,
  fetchAndCacheModels,
  createModel,
};
