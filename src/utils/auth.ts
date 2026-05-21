import fs from "fs"
import path from "path"
import { AppDirectory, makeAppDir } from "./os"
type ProviderAndKey = {
  provider: string,
  apiKey: string
}

const appendApiKey = (entry: ProviderAndKey) => {
  makeAppDir()
  const location = path.join(AppDirectory, "auth.json")
  let newData: { [key: string]: { [key: string]: string } } = {}; // this is so damn confusing to read holy
  let prevData = null;
  if (fs.existsSync(location)) {
    prevData = fs.readFileSync(location, { encoding: "utf8", flag: "r" })
  }
  if (prevData) newData = JSON.parse(prevData)
  newData[entry.provider] = { key: entry.apiKey, type: "api" }
  fs.writeFileSync(location, JSON.stringify(newData))
}

export { appendApiKey }
