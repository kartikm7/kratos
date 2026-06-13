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
import type { AiMessage } from "../state/types";

export const useLlm = () => {
  const llm = useAtomValue(llmAtom);
  const selectedModel = useAtomValue(selectedModelAtom);
  const [isLoading, setLoading] = useState(false);
  const setStream = useSetAtom(streamAtom);
  const tools = useAtomValue(toolsAtom);

  function updateLastMessage(text: string) {
    setStream((pre) => {
      const last = pre[pre.length - 1];
      if (last && (last.type == "reasoning" || last.type == "text")) {
        last.text += text;
      }
      return [...pre];
    });
  }

  function pushMessageToStream(message: AiMessage) {
    setStream((pre) => [...pre, message]);
  }

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
      let incomingReasoning = false;
      let incomingText = false;
      let lastPartType = "";
      for await (const part of (await result).fullStream) {
        switch (part.type) {
          case "text-start":
            incomingText = true;
            break;
          case "text-end":
            incomingText = false;
            break;
          case "reasoning-start":
            incomingReasoning = true;
            break;
          case "reasoning-end":
            incomingReasoning = false;
            break;
          case "text-delta":
            if (incomingText && lastPartType === "text-delta") {
              updateLastMessage(part.text);
            } else {
              pushMessageToStream({ type: "text", text: part.text });
            }
            break;
          case "reasoning-delta":
            if (incomingReasoning && lastPartType === "reasoning-delta")
              updateLastMessage(part.text);
            else {
              pushMessageToStream({ type: "reasoning", text: part.text });
            }
            break;
          // TODO: The tool call causes an error to be thrown not sure why ffs
          case "tool-call":
            // pushMessageToStream({
            //   type: "tool-call",
            //   toolName: part.toolName,
            //   toolCallId: part.toolCallId,
            //   input: part.input,
            // });
            break;
          case "tool-result":
            pushMessageToStream({
              type: "tool-result",
              toolName: part.toolName,
              toolCallId: part.toolCallId,
              output: part.output as any,
            });
            break;
          default:
            break;
        }
        lastPartType = part.type;
      }
      const res = await (await result).response;
      return res.messages;
    } catch (error) {
      toast.error(`Something went wrong: ${error}`);
      console.log(error);
    } finally {
      setStream([]);
      setLoading(false);
    }
  }
  return { isLoading, generate };
};
