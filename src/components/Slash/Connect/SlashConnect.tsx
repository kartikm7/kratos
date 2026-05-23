import { type DialogActions } from "@opentui-ui/dialog/react";
import { useState } from "react";
import { appendApiKey } from "../../../utils/auth";
import { Combobox } from "../../../ui/Combobox";
import { DialogHeader, DialogRoot } from "../../../ui/Dialog";
import { modelsListAtom } from "../../../state/atoms";
import { useAtomValue } from "jotai";

const SlashConnectDialog = () => {
  const [text, setText] = useState("")
  const list = useAtomValue(modelsListAtom)
  const flatenned = Object.entries(list ?? {}).map(entry => {
    return { name: entry[0], value: entry[0], description: "" }
  })
  const handleSubmit = () => {
    try {
      appendApiKey({ provider: "groq", apiKey: text })
    } catch (error) {
      console.log("Something went wrong", error)
    }
  }

  return <DialogRoot>
    <DialogHeader >
      Enter you API key
    </DialogHeader>
    {
      <Combobox placeholder="Choose a model" options={flatenned} />
      //   <>
      //   <input placeholder="API key" onSubmit={handleSubmit} onInput={setText} value={text} focused />
      //   <text>enter <span style={{ fg: "grey" }}>submit</span></text>
      // </>
    }
  </DialogRoot>
}

export const SlashConnect = (dialog: DialogActions) => {
  dialog.show({ content: () => <SlashConnectDialog /> });
}
