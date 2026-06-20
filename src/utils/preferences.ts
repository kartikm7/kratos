import fs from "fs";
import path from "path";
import { AppDirectory, makeAppDir } from "./os";
import type { Model } from "../state/types";

// TODO: Need to expand this to be more generic
const location = path.join(AppDirectory, "preferences.json");

const saveSelectedModel = (model: Model) => {
  makeAppDir();
  let data: { selectedModel?: Model } = {};
  if (fs.existsSync(location)) {
    const prevData = fs.readFileSync(location, { encoding: "utf8", flag: "r" });
    data = JSON.parse(prevData);
  }
  data.selectedModel = model;
  fs.writeFileSync(location, JSON.stringify(data));
};

const readSelectedModel = (): Model | undefined => {
  makeAppDir();
  if (!fs.existsSync(location)) return;
  const data = fs.readFileSync(location, { encoding: "utf8", flag: "r" });
  const parsed = JSON.parse(data) as { selectedModel?: Model };
  return parsed.selectedModel;
};

export { saveSelectedModel, readSelectedModel };
