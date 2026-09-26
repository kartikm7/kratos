import path from "path";
import { AppDirectory } from "../../os";
import fs from "fs"
const location = path.join(AppDirectory, "Memories");

// this is a basic function, what this does is that it ensures the location exists
function init() {
  if (fs.existsSync(location)) return
  fs.mkdirSync(location, { recursive: true });
}

// no try catch because, we will wrap it while calling the function
export function writeMemoryToFile(title: string, content: string) {
  // lowkey like a middleware
  init()
  const fileName = `${title}_${Date.now().toString()}.md`
  const fileLocation = path.join(location, fileName)
  fs.writeFileSync(fileLocation, content)
}
