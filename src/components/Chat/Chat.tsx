import { useTerminalDimensions } from "@opentui/react"
import { ChatLayout } from "../AppLayout"
import { Input } from "./Input"
import { streamText } from "ai"
import { createGroq } from '@ai-sdk/groq';
import { useState } from "react"
import { Markdown } from "../../ui/Markdown"

export const Chat = () => {
  const { width, height } = useTerminalDimensions()
  const [text, setText] = useState("")
  const [isLoading, setLoading] = useState(false)
  const [stream, setStream] = useState("")
  const groq = createGroq()

  const handleSubmit = async () => {
    if (text.trim().length != 0) {
      setLoading(true)
      const { textStream } = streamText({
        model: groq("openai/gpt-oss-20b"), prompt: text, onFinish: () => {
          setText("")
          setLoading(false)
        }
      })
      for await (const textPart of textStream) {
        setStream((pre) => pre + textPart)
      }
    }
  }

  return <ChatLayout>
    <box height={height * 0.7} justifyContent="center" alignItems="center" gap={0.5}>
      <scrollbox stickyScroll={true} stickyStart="bottom">
        <Markdown content={stream} streaming width={width} />
      </scrollbox>
    </box>
    <box alignItems="flex-start">
      <Input onInput={setText} onSubmit={handleSubmit} value={text} loading={isLoading} />
    </box>
  </ChatLayout>
}
