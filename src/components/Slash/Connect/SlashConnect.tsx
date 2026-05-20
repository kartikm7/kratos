import { type DialogActions } from "@opentui-ui/dialog/react";
import { useState } from "react";
import { appendApiKey } from "../../../utils/auth";

const SlashConnectDialog = () => {
  const [text, setText] = useState("")
  const handleSubmit = () => {
    try {
      appendApiKey({ provider: "groq", apiKey: text })
    } catch (error) {
      console.log("Something went wrong", error)
    }
  }

  return <box gap={1} padding={1}>
    <box flexDirection="row" justifyContent="space-between">
      <text>Enter you API key</text>
      <text fg="grey" >esc</text>
    </box>
    <input placeholder="API key" onSubmit={handleSubmit} onInput={setText} value={text} focused />
    <text>enter <span style={{ fg: "grey" }}>submit</span></text>
  </box>
}

export const SlashConnect = (dialog: DialogActions) => {
  dialog.show({ content: () => <SlashConnectDialog /> });
}
