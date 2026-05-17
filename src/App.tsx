import { DialogProvider } from "@opentui-ui/dialog/react";
import { RootLayout } from "./components/AppLayout";
import { Chat } from "./components/Chat/Chat";

export default function App() {
  return (
    <DialogProvider>
      <RootLayout>
        <Chat />
      </RootLayout>
    </DialogProvider>
  )
}
