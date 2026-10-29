import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { chatModeAtom, llmAtom, selectedModelAtom } from "../state/atoms";
import {
  DirectChatTransport,
  stepCountIs,
  ToolLoopAgent,
  type ChatTransport,
  type ToolSet,
  type UIMessage,
} from "ai";
import { SystemPrompts } from "../utils/prompts";
import { DEFAULT_AGENT_STEP_COUNT } from "../utils/constants";
import { DevToolsTelemetry } from "@ai-sdk/devtools";
import { getModeSpecificTools } from "../utils/tools/tools";
import { useChat, type UseChatHelpers } from "@ai-sdk/react";
import { useDb } from "./useDb";

export type UseLLM = UseChatHelpers<UIMessage<any, never>>;

export const useLlm = (): UseLLM => {
  const [llm, setLlm] = useAtom(llmAtom);
  const chatMode = useAtomValue(chatModeAtom);
  const { appendToChat } = useDb();
  const tools = getModeSpecificTools(chatMode);
  const selectedModel = useAtomValue(selectedModelAtom);

  const systemPrompt = SystemPrompts[chatMode];

  // no model selected yet -> keep the app usable, error only when a message is sent
  const transport: ChatTransport<UIMessage> = llm
    ? new DirectChatTransport({
        agent: new ToolLoopAgent({
          model: llm(selectedModel?.id),
          instructions: systemPrompt,
          tools: tools as ToolSet, // this shit is needed, but fuck it
          stopWhen: [stepCountIs(DEFAULT_AGENT_STEP_COUNT)], // TODO: Should have no limit mode, so that there aren't pauses
          telemetry: { integrations: [DevToolsTelemetry()] },
        }),
      })
    : {
        sendMessages: async () => {
          throw new Error("No model selected (use /model)");
        },
        reconnectToStream: async () => null,
      };

  const res = useChat({
    transport,
    onFinish: ({ message, messages }) => {
      appendToChat(message);
    },
  });

  return { ...res };
};
