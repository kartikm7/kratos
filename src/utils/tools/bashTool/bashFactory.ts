import { createBashTool } from "bash-tool";
import {
  Bash,
  InMemoryFs,
  MountableFs,
  OverlayFs,
  ReadWriteFs,
  type IFileSystem,
} from "just-bash";
import { AppDirectory } from "../../os";

export const BashFactory = async (readWrite = false) => {
  // ReadWriteFs gives full read-write access, but only to the directory we have allowed - rest are blocked out.
  let baseFs = new OverlayFs({
    root: process.cwd(),
    mountPoint: "/",
  }) as IFileSystem;
  if (readWrite) {
    baseFs = new ReadWriteFs({
      root: process.cwd(),
    });
  }

  const kratosFs = new ReadWriteFs({ root: AppDirectory });
  const mainFs = new MountableFs({
    base: baseFs,
    mounts: [{ mountPoint: "/.kratos", filesystem: kratosFs }],
  });
  // there is a very strong reason for doing this, there is some underlying function in createBashTool
  // that fails to resolve the path due to `/dev/null` not being present in Windows Systems
  // so what we do is just create an in-memory reference to fool the system gangggg
  mainFs.mount("/dev", new InMemoryFs());
  const sandboxBash = new Bash({
    fs: mainFs,
    cwd: "/",
  });

  const { tools } = await createBashTool({
    sandbox: sandboxBash,
    destination: "/",
    extraInstructions: `While using bash-tool, you might have trouble traversing,
- the current working directory is mounted at "\\" (contains user files)
  - eg. cat \\src\\index.ts
- the app directory is mounted at "\\.kratos" (contains Memories folder)
  - eg. cat \\.kratos\\Memories\\test.md
    `,
  });
  const { bash, readFile, writeFile } = tools;
  return { bash, readFile, writeFile };
};
