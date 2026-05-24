import { DialogProvider } from "@opentui-ui/dialog/react";
import { toast, Toaster } from "@opentui-ui/toast/react";
import { RootLayout } from "./components/AppLayout";
import { Chat } from "./components/Chat/Chat";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { connectedProvidersAtom, modelsListAtom } from "./state/atoms";
import { fetchAndCacheModels } from "./utils/models";
import { readAuth } from "./utils/auth";

export default function App() {
  const setModelsList = useSetAtom(modelsListAtom)
  const setConnectedProvidersList = useSetAtom(connectedProvidersAtom)

  useEffect(() => {
    fetchAndSetModelsList()
    setConnectedProvidersList(readAuth()) // this is just getting data for whatever models we currently have

    async function fetchAndSetModelsList() {
      const res = await fetchAndCacheModels()
      if (!res) toast.error("Model list is empty")
      else setModelsList(JSON.parse(JSON.parse(res))) // this is so fucking weird
    }
  }, [])

  return (
    <>
      <Toaster position="top-right" />
      <DialogProvider>
        <RootLayout>
          <Chat />
        </RootLayout>
      </DialogProvider>
    </>
  )
}
