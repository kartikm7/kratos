import { DialogProvider } from "@opentui-ui/dialog/react";
import { RootLayout } from "./components/AppLayout";
import { Chat } from "./components/Chat/Chat";
import { createContext, useContext, useEffect } from "react";
import { useSetAtom } from "jotai";
import {
  collapseAtom,
  connectedProvidersAtom,
  llmAtom,
  selectedModelAtom,
} from "./state/atoms";
import { createModel } from "./utils/models";
import { readAuth } from "./utils/auth";
import { readSelectedModel } from "./utils/preferences";
import type { Model } from "./state/types";
import {
  useKeyboard,
  useRenderer,
  useSelectionHandler,
  useTerminalDimensions,
} from "@opentui/react";
import { DimensionsContext } from "./context/context";
import { useRefreshModelsJson } from "./hooks/useRefreshModelsJson";
import { ChatProvider } from "./providers/ChatProvider";
import { Toaster } from "./ui/Toaster";
import { useToast } from "./hooks/useToast";
import { ClipboardTarget } from "@opentui/core";

export default function App() {
  const setConnectedProvidersList = useSetAtom(connectedProvidersAtom);
  const setSelectedModel = useSetAtom(selectedModelAtom);
  const setLlm = useSetAtom(llmAtom);
  const setCollapse = useSetAtom(collapseAtom);
  const { width, height } = useTerminalDimensions();
  const { fetchAndSetModelsList } = useRefreshModelsJson();
  const { toast } = useToast();
  const renderer = useRenderer();

  useSelectionHandler((selection) => {
    try {
      const text = selection.getSelectedText();
      renderer.copyToClipboardOSC52(text, ClipboardTarget.Primary);
      // TODO: Update state somewhere! (Most likely in DynamicInfoBar)
    } catch (e) {
      toast.error((e as Error).message ?? "Error while copying");
    }
  });

  // Global shortcut's to be defined here!
  useKeyboard((key) => {
    if (key.ctrl && key.name == "o") {
      setCollapse((pre) => !pre);
    }
  });

  useEffect(() => {
    fetchAndSetModelsList();
    const connectedProviders = readAuth();
    const selectedModel = readSelectedModel();
    setSelectedModel(selectedModel); // load cached model
    setConnectedProvidersList(connectedProviders);

    if (selectedModel) {
      // creating model
      const model = createModel(
        selectedModel as Model,
        connectedProviders || {},
      );
      setLlm(() => model);
    }
  }, []);

  return (
    <>
      <DimensionsContext value={{ width, height }}>
        <ChatProvider>
          <Toaster />
          <DialogProvider backdropOpacity={0}>
            <RootLayout>
              <Chat />
            </RootLayout>
          </DialogProvider>
        </ChatProvider>
      </DimensionsContext>
    </>
  );
}
