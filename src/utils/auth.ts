import fs from "fs";
import path from "path";
import { AppDirectory, makeAppDir } from "./os";
import type {
  ConnectedProvider,
  ConnectedProvidersList,
} from "../state/types";

const location = path.join(AppDirectory, "auth.json");

const saveProviderConfig = (
  provider: string,
  config: ConnectedProvider,
): ConnectedProvidersList => {
  makeAppDir();
  const previousData = readAuth() ?? {};
  const nextData = {
    ...previousData,
    [provider]: config,
  };
  fs.writeFileSync(location, JSON.stringify(nextData));
  return nextData;
};

const readAuth = () => {
  makeAppDir();
  if (!fs.existsSync(location)) return;
  const data = fs.readFileSync(location, { encoding: "utf8", flag: "r" });
  return JSON.parse(data) as ConnectedProvidersList;
};

export { saveProviderConfig, readAuth };
