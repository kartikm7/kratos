import { createCliRenderer } from "@opentui/core";
import { createRoot, useKeyboard } from "@opentui/react";
import App from "./App";

function Main() {
  useKeyboard((key) => {
    if (key.name == "f12") renderer.console.toggle();
  });
  return <App />;
}

const renderer = await createCliRenderer();
createRoot(renderer).render(<Main />);
