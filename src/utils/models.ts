import axios from "axios";
import path from "path";
import fs from "fs";
import { AppDirectory, makeAppDir } from "./os";

const location = path.join(AppDirectory, "models.json");
async function getModels() {
  const response = await axios.get("https://models.dev/api.json");
  const data = response.data;
  return JSON.stringify(data);
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

export {
  getModels,
  cacheModels,
  modelsCached,
  cachedModels,
  fetchAndCacheModels,
};
