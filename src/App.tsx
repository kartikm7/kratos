import { DialogProvider } from "@opentui-ui/dialog/react";
import { toast, Toaster } from "@opentui-ui/toast/react";
import { RootLayout } from "./components/AppLayout";
import { Chat } from "./components/Chat/Chat";
import { createContext, useContext, useEffect } from "react";
import { useSetAtom } from "jotai";
import {
  collapseAtom,
  connectedProvidersAtom,
  llmAtom,
  modelsListAtom,
  selectedModelAtom,
} from "./state/atoms";
import { createModel, fetchAndCacheModels } from "./utils/models";
import { readAuth } from "./utils/auth";
import { readSelectedModel } from "./utils/preferences";
import type { Model } from "./state/types";
import { useKeyboard, useTerminalDimensions } from "@opentui/react";
import { DimensionsContext } from "./context/context";
import { useRefreshModelsJson } from "./hooks/useRefreshModelsJson";
import { ChatProvider } from "./providers/ChatProvider";

export default function App() {
  const setModelsList = useSetAtom(modelsListAtom);
  const setConnectedProvidersList = useSetAtom(connectedProvidersAtom);
  const setSelectedModel = useSetAtom(selectedModelAtom);
  const setLlm = useSetAtom(llmAtom);
  const setCollapse = useSetAtom(collapseAtom);
  const { width, height } = useTerminalDimensions()
  const { fetchAndSetModelsList } = useRefreshModelsJson()

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
          <Toaster position="top-right" />
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
