import { useKeyboard } from "@opentui/react";
import { ChatLayout } from "../AppLayout";
import { Input } from "./Input";
import { type UserModelMessage } from "ai";
import { useContext, useState } from "react";
import { chatModeAtom } from "../../state/atoms";
import { useAtom } from "jotai";
import { Messages } from "./Messages/Messages";
import { AsciiTitle } from "./AsciiTitle";
import { DynamicInfoBar } from "./DynamicInfoBar";
import { CHAT_MODES, type ChatModes } from "../../utils/constants";
import { DimensionsContext } from "../../context/context";
import { useChatContext } from "../../hooks/useChatContext";

export const Chat = () => {
  const { height } = useContext(DimensionsContext);
  const [text, setText] = useState("");
  const { messages, sendMessage, status, stop } = useChatContext();
  const [chatMode, setChatMode] = useAtom(chatModeAtom);
  const completionPending = status == "streaming" || status == "submitted";
  const streamingDone = status == "ready";

  useKeyboard((key) => {
    if (key.shift && key.name == "tab") {
      // finding the current idx
      const idx = CHAT_MODES.findIndex((val) => {
        return val == chatMode;
      });
      // normalizing the next idx
      let nextIdx = Math.min(idx + 1, CHAT_MODES.length);
      nextIdx = nextIdx == CHAT_MODES.length ? 0 : nextIdx;
      // indexing the next mode
      const nextMode = CHAT_MODES[nextIdx] as ChatModes; // this is so fucking stupid, but need to do this since the above code is determined
      // updating global states
      setChatMode(nextMode);
    }
    if (key.name == "escape" && completionPending) {
      stop();
    }
  });

  const handleSubmit = async () => {
    const empty = text.trim().length == 0;
    const slashCommand = text.trim().charAt(0) == "/";
    // TODO: the moment we introduce prompts that can be accessed via this, we are fucked
    // all I'm saying is this is not intuitive nor is it scalable, not intuitive because the same check is maintained in two functions
    // but who cares, if it works it works
    console.log(!empty && !slashCommand);
    if (!empty && !slashCommand) {
      sendMessage({ text: text });
    }
  };

  return (
    <ChatLayout>
      <box
        height={height * 0.85}
        justifyContent="center"
        alignItems="center"
        gap={0.5}
      >
        {messages.length > 0 ? (
          <scrollbox stickyScroll={true} stickyStart="bottom">
            <Messages messages={messages} streaming={status == "streaming"} />
          </scrollbox>
        ) : (
          <box justifyContent="center" alignItems="center" gap={2}>
            <AsciiTitle />
            <text>Aims to assist, not replace you.</text>
          </box>
        )}
      </box>
      <box flexDirection="row" flexWrap="wrap">
        <Input
          onTextChange={(t) => setText(t)}
          onSubmit={handleSubmit}
          focused={streamingDone}
        />
        <DynamicInfoBar loading={completionPending} />
      </box>
    </ChatLayout>
  );
};
