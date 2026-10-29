import fs from "fs";
import path from "path";
import { AppDirectory } from "./os";
import type { ConnectedProvider, ConnectedProvidersList } from "../state/types";

const location = path.join(AppDirectory, "auth.json");

const saveProviderConfig = (
  provider: string,
  config: ConnectedProvider,
): ConnectedProvidersList => {
  const previousData = readAuth() ?? {};
  const nextData = {
    ...previousData,
    [provider]: config,
  };
  fs.writeFileSync(location, JSON.stringify(nextData));
  return nextData;
};

const readAuth = () => {
  if (!fs.existsSync(location)) return;
  const data = fs.readFileSync(location, { encoding: "utf8", flag: "r" });
  return JSON.parse(data) as ConnectedProvidersList;
};

export { saveProviderConfig, readAuth };
