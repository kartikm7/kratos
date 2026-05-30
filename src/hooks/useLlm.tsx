import { useAtomValue, useSetAtom } from "jotai"
import { llmAtom, selectedModelAtom, streamAtom } from "../state/atoms"
import { streamText, type ModelMessage } from "ai"
import { useState } from "react"
import { toast } from "@opentui-ui/toast/react"

export const useLlm = () => {

  const llm = useAtomValue(llmAtom)
  const selectedModel = useAtomValue(selectedModelAtom)
  const [isLoading, setLoading] = useState(false)
  const setStream = useSetAtom(streamAtom)

  async function generate(messages: ModelMessage[]) {
    try {
      setLoading(true)
      if (!llm) throw new Error("Missing LLM")
      const { textStream, response, fullStream } = streamText({
        model: llm(selectedModel?.id), providerOptions: {},
        onError: ({ error }) => {
          toast.error(`${error}`)
        },
        messages: messages
      })
      for await (const textPart of textStream) {
        setStream((pre) => pre + textPart)
      }
      const res = await response
      setStream("")
      return res.messages
    } catch (error) {
      toast.error(`Something went wrong: ${error}`)
    } finally {
      setLoading(false)
    }
  }
  return { isLoading, generate }
} 
