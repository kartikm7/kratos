import { createCliRenderer } from "@opentui/core";
import { createRoot, useKeyboard } from "@opentui/react";
import App from "./App";

function Main() {
  // this is really helpful for figuring out what is propogating the memory leak
  process.on('warning', e => console.warn(e.stack));
  useKeyboard((key) => {
    if (key.name == "f12") renderer.console.toggle();
  });
  return <App />;
}

const renderer = await createCliRenderer();
createRoot(renderer).render(<Main />);
