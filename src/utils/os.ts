import path from "path";
import os from "os";
import fs from "fs";

const AppDirectory = path.join(os.homedir(), ".kratos");

const makeAppDir = () => {
  if (!fs.existsSync(AppDirectory)) {
    console.log("Creating AppDirectory");
    fs.mkdirSync(AppDirectory, { recursive: true });
  }
};

export { AppDirectory, makeAppDir };
