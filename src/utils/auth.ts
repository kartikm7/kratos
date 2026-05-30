import fs from "fs";
import path from "path";
import { AppDirectory, makeAppDir } from "./os";
import type { ConnectedProvidersList } from "../state/types";
type ProviderAndKey = {
  provider: string;
  apiKey: string;
};

const location = path.join(AppDirectory, "auth.json");
const appendApiKey = (entry: ProviderAndKey) => {
  makeAppDir();
  let newData: { [key: string]: { [key: string]: string } } = {}; // this is so damn confusing to read holy
  let prevData = null;
  if (fs.existsSync(location)) {
    prevData = fs.readFileSync(location, { encoding: "utf8", flag: "r" });
  }
  if (prevData) newData = JSON.parse(prevData);
  newData[entry.provider] = { key: entry.apiKey, type: "api" };
  fs.writeFileSync(location, JSON.stringify(newData));
};

const readAuth = () => {
  makeAppDir();
  if (!fs.existsSync(location)) return;
  const data = fs.readFileSync(location, { encoding: "utf8", flag: "r" });
  return JSON.parse(data) as ConnectedProvidersList;
};
export { appendApiKey, readAuth };
