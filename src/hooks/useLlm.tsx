import { useAtomValue, useSetAtom } from "jotai";
import {
  chatModeAtom,
  llmAtom,
  selectedModelAtom,
  streamAtom,
  toolsAtom,
} from "../state/atoms";
import {
  stepCountIs,
  ToolLoopAgent,
  type AssistantModelMessage,
  type ModelMessage,
  type ToolSet,
} from "ai";
import { useRef, useState } from "react";
import { toast } from "@opentui-ui/toast/react";
import { SystemPrompts } from "../utils/prompts";
import type { AiMessage, MessageStream } from "../state/types";
import { useKeyboard } from "@opentui/react";
import { DEFAULT_AGENT_STEP_COUNT } from "../utils/constants";

export const useLlm = () => {
  const llm = useAtomValue(llmAtom);
  const selectedModel = useAtomValue(selectedModelAtom);
  const chatMode = useAtomValue(chatModeAtom);
  const [isLoading, setLoading] = useState(false);
  const setStream = useSetAtom(streamAtom);
  let streamCache: MessageStream = []; // this is irritating the fuck out of me, but there's no choice but to do this
  const tools = useAtomValue(toolsAtom);
  let abortController = new AbortController();
  const ref = useRef(abortController);

  // useEffect(() => {}, [ref.current]);
  useKeyboard((key) => {
    if (key.name == "escape") {
      if (ref.current) ref.current.abort("userCancelled");
    }
  });

  function updateLastMessageCache(text: string) {
    let last = streamCache.pop();
    if (last && (last.type == "reasoning" || last.type == "text")) {
      last = { ...last, text: last.text + text };
    }
    if (last) streamCache.push(last);
  }

  function updateLastMessage(text: string) {
    setStream((pre) => {
      const last = pre[pre.length - 1];
      if (last && (last.type == "reasoning" || last.type == "text")) {
        last.text += text;
      }
      return [...pre];
    });
    updateLastMessageCache(text);
  }

  function pushMessageToStream(message: AiMessage) {
    setStream((pre) => [...pre, message]);
    streamCache.push(message);
  }

  async function generate(messages: ModelMessage[]) {
    try {
      setLoading(true);
      if (!llm) throw new Error("Missing LLM");
      const systemPrompt = SystemPrompts[chatMode];
      const agent = new ToolLoopAgent({
        model: llm(selectedModel?.id),
        instructions: systemPrompt,
        tools: tools as ToolSet, // this shit is needed, but fuck it
        stopWhen: [stepCountIs(DEFAULT_AGENT_STEP_COUNT)], // TODO: Should have no limit mode, so that there aren't pauses
      });
      const result = agent.stream({
        messages: messages,
        abortSignal: ref.current.signal,
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
            if (incomingReasoning && lastPartType === "reasoning-delta") {
              updateLastMessage(part.text);
            } else {
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
      if (error == "userCancelled") {
        const modelMessage: AssistantModelMessage[] = [
          { role: "assistant", content: streamCache },
        ];
        return modelMessage;
      }
      toast.error(`${error}`);
    } finally {
      setStream([]);
      ref.current = new AbortController();
      setLoading(false);
      streamCache = [];
    }
  }
  return { isLoading, generate };
};
