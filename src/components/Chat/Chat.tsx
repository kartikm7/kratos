import { useTerminalDimensions } from "@opentui/react"
import { ChatLayout } from "../AppLayout"
import { Input } from "./Input"
import { type ModelMessage, type UserModelMessage } from "ai"
import { useEffect, useState } from "react"
import { Markdown } from "../../ui/Markdown"
import { streamAtom } from "../../state/atoms";
import { useAtom, useAtomValue } from "jotai";
import { useLlm } from "../../hooks/useLlm"
import { toast } from "@opentui-ui/toast/react"
import { Messages } from "./Messages/Messages"

export const Chat = () => {
  const { width, height } = useTerminalDimensions()
  const [text, setText] = useState("")
  const stream = useAtomValue(streamAtom)
  const [messages, setMessages] = useState<ModelMessage[]>([])
  const { isLoading, generate } = useLlm()

  const handleSubmit = async () => {
    if (text.trim().length != 0) {
      const prompt: UserModelMessage = { role: "user", content: text }
      const history = [...messages, prompt]
      setMessages(history)
      const res = await generate(history)
      if (!res) {
        toast.error("Something went wrong while generating")
        return
      }
      setMessages(pre => [...pre, ...res])
      setText("")
    }
  }

  return <ChatLayout>
    <box height={height * 0.7} justifyContent="center" alignItems="center" gap={0.5}>
      <scrollbox stickyScroll={true} stickyStart="bottom">
        <Messages messages={messages} />
        {/* <Markdown content={stream} streaming width={width} /> */}
      </scrollbox>
    </box>
    <box alignItems="flex-start">
      <Input onInput={setText} onSubmit={handleSubmit} value={text} loading={isLoading} />
    </box>
  </ChatLayout>
}
