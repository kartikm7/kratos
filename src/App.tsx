import { DialogProvider } from "@opentui-ui/dialog/react";
import { RootLayout } from "./components/AppLayout";
import { Chat } from "./components/Chat/Chat";
import { useEffect } from "react";
import { getModels } from "./utils/models";

export default function App() {
  useEffect(() => {
    getModels()
  }, [])
  return (
    <DialogProvider>
      <RootLayout>
        <Chat />
      </RootLayout>
    </DialogProvider>
  )
}
