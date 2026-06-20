import { DialogProvider } from "@opentui-ui/dialog/react";
import { toast, Toaster } from "@opentui-ui/toast/react";
import { RootLayout } from "./components/AppLayout";
import { Chat } from "./components/Chat/Chat";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import {
  connectedProvidersAtom,
  llmAtom,
  modelsListAtom,
  selectedModelAtom,
} from "./state/atoms";
import { createModel, fetchAndCacheModels } from "./utils/models";
import { readAuth } from "./utils/auth";
import { readSelectedModel } from "./utils/preferences";
import type { Model } from "./state/types";

export default function App() {
  const setModelsList = useSetAtom(modelsListAtom);
  const setConnectedProvidersList = useSetAtom(connectedProvidersAtom);
  const setSelectedModel = useSetAtom(selectedModelAtom);
  const setLlm = useSetAtom(llmAtom);

  useEffect(() => {
    fetchAndSetModelsList();
    const connectedProviders = readAuth();
    const selectedModel = readSelectedModel();
    setSelectedModel(selectedModel); // load cached model
    setConnectedProvidersList(connectedProviders);

    // this is just getting data for whatever models we currently have

    async function fetchAndSetModelsList() {
      const modelsList = await fetchAndCacheModels();
      if (!modelsList) {
        toast.error("Model list is empty");
        return; // returning early
      } else setModelsList(JSON.parse(JSON.parse(modelsList))); // this is so fucking weird

      if (selectedModel) {
        // creating model
        const model = createModel(
          selectedModel as Model,
          connectedProviders || {},
        );
        setLlm(() => model);
      }
    }
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <DialogProvider>
        <RootLayout>
          <Chat />
        </RootLayout>
      </DialogProvider>
    </>
  );
}
