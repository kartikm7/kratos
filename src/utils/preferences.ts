import fs from "fs";
import path from "path";
import { AppDirectory } from "./os";
import type { Model, Preferences } from "../state/types";

// TODO: Need to expand this to be more generic
const location = path.join(AppDirectory, "preferences.json");

const readPreferences = (): Preferences => {
  if (!fs.existsSync(location)) return {};
  const data = fs.readFileSync(location, { encoding: "utf8", flag: "r" });
  const parsed = JSON.parse(data) as Preferences;
  return parsed
}

const updatePreferences = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
  const pref = readPreferences()
  pref[key] = value
  fs.writeFileSync(location, JSON.stringify(pref));
}

export { updatePreferences, readPreferences };
