import { useDialog, type DialogActions } from "@opentui-ui/dialog/react";
import { useState } from "react";
import { appendApiKey } from "../../../utils/auth";
import { Combobox } from "../../../ui/Combobox";
import { DialogHeader, DialogRoot } from "../../../ui/Dialog";
import { modelsListAtom } from "../../../state/atoms";
import { useAtomValue } from "jotai";
import type { SelectOption } from "@opentui/core";
import { toast } from "@opentui-ui/toast/react";

const SlashConnectDialog = () => {
  const [text, setText] = useState("");
  const list = useAtomValue(modelsListAtom);
  const [comboxboxValue, setComboboxValue] = useState<
    SelectOption | undefined
  >();
  const dialog = useDialog();
  const flatenned = Object.entries(list ?? {}).map((entry) => {
    return { name: entry[0], value: entry[0], description: "" };
  });
  const handleSubmit = () => {
    try {
      if (!comboxboxValue) {
        toast.error("Provider name is missing dawg");
        return; // early return
      }
      appendApiKey({ provider: comboxboxValue.name, apiKey: text });
      dialog.closeAll();
      toast.success(`${comboxboxValue.value} api key has been added!`);
    } catch (error) {
      toast.error(`Something went wrong ${error}`);
      console.log("Something went wrong", error);
    }
  };

  return (
    <DialogRoot>
      <DialogHeader>
        {comboxboxValue ? "Enter you API key" : "Choose a model provider"}
      </DialogHeader>
      {!comboxboxValue ? (
        <Combobox
          setSubmitValue={setComboboxValue}
          placeholder="Model provider"
          options={flatenned}
        />
      ) : (
        <>
          <input
            placeholder="API key"
            onSubmit={handleSubmit}
            onInput={setText}
            value={text}
            focused
          />
          <text>
            enter <span style={{ fg: "grey" }}>submit</span>
          </text>
        </>
      )}
    </DialogRoot>
  );
};

export const SlashConnect = (dialog: DialogActions) => {
  dialog.show({ content: () => <SlashConnectDialog /> });
};
