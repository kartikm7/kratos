import { useTerminalDimensions } from "@opentui/react";
import { ChatLayout } from "../AppLayout";
import { Input } from "./Input";
import { type ModelMessage, type UserModelMessage } from "ai";
import { useState } from "react";
import { streamAtom } from "../../state/atoms";
import { useAtomValue } from "jotai";
import { useLlm } from "../../hooks/useLlm";
import { Messages } from "./Messages/Messages";
import { AsciiTitle } from "./AsciiTitle";
import { StaticInfoBar } from "./StaticInfoBar";

export const Chat = () => {
  const { width, height } = useTerminalDimensions();
  const [text, setText] = useState("");
  const stream = useAtomValue(streamAtom);
  const [messages, setMessages] = useState<ModelMessage[]>([]);
  const { isLoading, generate } = useLlm();

  const handleSubmit = async () => {
    if (text.trim().length != 0) {
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
        height={height * 0.7}
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
            {/* <Markdown content={stream} streaming width={width} /> */}
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
        <StaticInfoBar />
      </box>
    </ChatLayout>
  );
};
