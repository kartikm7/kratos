import { DialogProvider } from "@opentui-ui/dialog/react";
import { toast, Toaster } from "@opentui-ui/toast/react";
import { RootLayout } from "./components/AppLayout";
import { Chat } from "./components/Chat/Chat";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { connectedProvidersAtom, modelsListAtom } from "./state/atoms";
import {
  fetchAndCacheModels,
  hydrateLocalModels,
  parseModelsList,
} from "./utils/models";
import { readAuth } from "./utils/auth";

export default function App() {
  const setModelsList = useSetAtom(modelsListAtom);
  const setConnectedProvidersList = useSetAtom(connectedProvidersAtom);

  useEffect(() => {
    const savedProviders = readAuth();
    setConnectedProvidersList(savedProviders);
    fetchAndSetModelsList();

    async function fetchAndSetModelsList() {
      const res = await fetchAndCacheModels();
      if (!res) toast.error("Model list is empty");
      else {
        const remoteModels = parseModelsList(res);
        const hydratedModels = await hydrateLocalModels(
          remoteModels,
          savedProviders,
        );
        setModelsList(hydratedModels);
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
