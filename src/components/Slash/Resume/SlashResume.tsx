import { useDialog, type DialogActions } from "@opentui-ui/dialog/react";
import { Combobox } from "../../../ui/Combobox";
import { DialogHeader, DialogRoot } from "../../../ui/Dialog";
import type { SelectOption } from "@opentui/core";
import { useToast } from "../../../hooks/useToast";
import { useDb } from "../../../hooks/useDb";
import { useSetAtom } from "jotai";
import { chatIdAtom } from "../../../state/atoms";
import { useChatContext } from "../../../hooks/useChatContext";
import type { UIMessage } from "ai";

// list based on connectedProviders
const SlashResumeDialog = () => {
  const { toast } = useToast();
  const dialog = useDialog();
  const { getAllChats, getChat, filterChat } = useDb();
  const { setMessages } = useChatContext();
  const setChatId = useSetAtom(chatIdAtom);

  const allChats = getAllChats();
  if (!allChats) return;

  const options = allChats.map((val) => {
    return {
      name: val.title,
      value: val,
      description: "",
    };
  });

  const handleSubmit = async (comboxboxValue: SelectOption | undefined) => {
    try {
      if (!comboxboxValue) {
        toast.error("Chat is missing dawg");
        return; // early return
      }
      const chatId = comboxboxValue.value.id;
      setChatId(chatId);
      let chat = chatId ? filterChat(getChat(Number(chatId))) : [];
      if (chat.length > 0) setMessages(chat);
      toast.success(`Resumed chat: ${comboxboxValue.name}`);
      dialog.closeAll();
    } catch (error) {
      toast.error(`Something went wrong ${error}`);
      console.log("Something went wrong", error);
    }
  };

  return (
    <DialogRoot>
      <DialogHeader>Choose a model</DialogHeader>
      <Combobox
        onSubmit={handleSubmit}
        showDescription
        placeholder="Chat"
        options={options}
      />
    </DialogRoot>
  );
};

export const SlashResume = (dialog: DialogActions) => {
  dialog.show({ content: () => <SlashResumeDialog /> });
};
