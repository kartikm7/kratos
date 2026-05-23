import { DialogProvider } from "@opentui-ui/dialog/react";
import { toast, Toaster } from "@opentui-ui/toast/react";
import { RootLayout } from "./components/AppLayout";
import { Chat } from "./components/Chat/Chat";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { modelsListAtom } from "./state/atoms";
import { fetchAndCacheModels } from "./utils/models";
import type { ModelsList } from "./state/types";

export default function App() {
  const setModelsList = useSetAtom(modelsListAtom)

  useEffect(() => {
    fetchAndSetModelsList()

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
