import { useAtomValue, useSetAtom } from "jotai";
import {
  llmAtom,
  selectedModelAtom,
  streamAtom,
  toolsAtom,
} from "../state/atoms";
import { ToolLoopAgent, type ModelMessage } from "ai";
import { useState } from "react";
import { toast } from "@opentui-ui/toast/react";
import { KratosSystemPrompt } from "../utils/prompts";

export const useLlm = () => {
  const llm = useAtomValue(llmAtom);
  const selectedModel = useAtomValue(selectedModelAtom);
  const [isLoading, setLoading] = useState(false);
  const setStream = useSetAtom(streamAtom);
  const tools = useAtomValue(toolsAtom);
  async function generate(messages: ModelMessage[]) {
    try {
      setLoading(true);
      if (!llm) throw new Error("Missing LLM");
      const agent = new ToolLoopAgent({
        model: llm(selectedModel?.id),
        // instructions: KratosSystemPrompt,
        tools: tools,
      });
      const result = agent.stream({
        messages: messages,
      });
      for await (const textPart of (await result).textStream) {
        setStream((pre) => pre + textPart);
      }
      const res = await (await result).response;
      setStream("");
      return res.messages;
    } catch (error) {
      toast.error(`Something went wrong: ${error}`);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  return { isLoading, generate };
};
