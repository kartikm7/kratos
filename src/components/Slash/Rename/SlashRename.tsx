import { useDialog, type DialogActions } from "@opentui-ui/dialog/react";
import { useState } from "react";
import { useDb } from "../../../hooks/useDb";
import { useToast } from "../../../hooks/useToast";
import { DialogHeader, DialogRoot } from "../../../ui/Dialog";
import { SecondaryText } from "../../../ui/SecondaryText";
import { Separator } from "../../../ui/Separator";

const SlashRenameDialog = () => {
  const [text, setText] = useState("");
  const { updateChatTitle } = useDb();
  const dialog = useDialog();
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      if (!text.trim()) {
        toast.error("Chat title cannot be empty");
        return;
      }

      await updateChatTitle(text.trim());
      toast.success("Chat renamed successfully!");
      dialog.closeAll();
    } catch (error) {
      toast.error(`Something went wrong ${error}`);
      console.log("Something went wrong", error);
    }
  };

  return (
    <DialogRoot>
      <DialogHeader>Rename chat</DialogHeader>
      <Separator />
      <input
        placeholder="Enter new title"
        onSubmit={handleSubmit}
        onInput={setText}
        value={text}
        focused
      />
      <box flexDirection="row" columnGap={1}>
        <text>enter</text>
        <SecondaryText>submit</SecondaryText>
      </box>
    </DialogRoot>
  );
};

export const SlashRename = (dialog: DialogActions) => {
  dialog.show({ content: () => <SlashRenameDialog /> });
};
