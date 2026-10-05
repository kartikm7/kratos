import { createCliRenderer } from "@opentui/core";
import { createRoot, useKeyboard } from "@opentui/react";
import App from "./App";
import { BashFactory } from "./utils/tools/bashTool/bashFactory";

function Main() {
  // this is really helpful for figuring out what is propogating the memory leak
  process.on('warning', e => console.warn(e.stack));
  useKeyboard((key) => {
    if (key.name == "f12") renderer.console.toggle();
  });
  return <App />;
}

// Function calls outside of react process
const ReadWriteBashTools = await BashFactory(true)
const OnlyReadBashTools = await BashFactory(false)

const renderer = await createCliRenderer();
createRoot(renderer).render(<Main />);

// Exporting the functions called outside of react process
export { ReadWriteBashTools, OnlyReadBashTools }
