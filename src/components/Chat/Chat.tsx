import { useKeyboard, useTerminalDimensions } from "@opentui/react";
import { ChatLayout } from "../AppLayout";
import { Input } from "./Input";
import { type ModelMessage, type UserModelMessage } from "ai";
import { useState } from "react";
import { chatModeAtom, messagesAtom, streamAtom, toolsAtom } from "../../state/atoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useLlm } from "../../hooks/useLlm";
import { Messages } from "./Messages/Messages";
import { AsciiTitle } from "./AsciiTitle";
import { DynamicInfoBar } from "./DynamicInfoBar";
import { CHAT_MODES, type ChatModes } from "../../utils/constants";
import { getModeSpecificTools } from "../../utils/tools/tools";

export const Chat = () => {
  const { height } = useTerminalDimensions();
  const [text, setText] = useState("");
  const stream = useAtomValue(streamAtom);
  const [messages, setMessages] = useAtom(messagesAtom);
  const { isLoading, generate } = useLlm();
  const [chatMode, setChatMode] = useAtom(chatModeAtom);
  const setTools = useSetAtom(toolsAtom);

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
      setTools(getModeSpecificTools(nextMode));
    }
  });

  const handleSubmit = async () => {
    const empty = text.trim().length == 0
    const slashCommand = text.trim().charAt(0) == "/"
    // TODO: the moment we introduce prompts that can be accessed via this, we are fucked
    // all I'm saying is this is not intuitive nor is it scalable, not intuitive because the same check is maintained in two functions
    // but who cares, if it works it works
    console.log(!empty && !slashCommand)
    if (!empty && !slashCommand) {
      const prompt: UserModelMessage = { role: "user", content: text };
      const history = [...messages, prompt];
      setMessages(history);
      const res = await generate(history);
      if (!res) {
        setMessages((pre) => pre.slice(0, pre.length - 1));
        return;
      }
      setMessages((pre) => [...pre, ...res]);
      setText("");
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
            <Messages messages={messages} />
            {stream && (
              <Messages
                messages={[{ role: "assistant", content: stream }]}
                streaming
              />
            )}
          </scrollbox>
        ) : (
          <box justifyContent="center" alignItems="center" gap={2}>
            <AsciiTitle />
            <text>Aims to assist, not replace you.</text>
          </box>
        )}
      </box>
      <box alignItems="flex-start">
        <Input
          onInput={setText}
          onSubmit={handleSubmit}
          value={text}
          loading={isLoading}
        />
        <DynamicInfoBar loading={isLoading} />
      </box>
    </ChatLayout>
  );
};
