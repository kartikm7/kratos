import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  chatModeAtom,
  llmAtom,
  selectedModelAtom,
  streamAtom,
  // toolsAtom,
} from "../state/atoms";
import {
  DirectChatTransport,
  stepCountIs,
  ToolLoopAgent,
  type ToolSet,
  type UIMessage,
} from "ai";
import { SystemPrompts } from "../utils/prompts";
import { DEFAULT_AGENT_STEP_COUNT } from "../utils/constants";
import { DevToolsTelemetry } from '@ai-sdk/devtools';
import { getModeSpecificTools } from "../utils/tools/tools";
import { useChat, type UseChatHelpers } from "@ai-sdk/react";

export type UseLLM = UseChatHelpers<UIMessage<any, never>>

export const useLlm = (): UseLLM => {
  const [llm, setLlm] = useAtom(llmAtom);
  const chatMode = useAtomValue(chatModeAtom);
  const tools = getModeSpecificTools(chatMode)
  const selectedModel = useAtomValue(selectedModelAtom)

  if (!llm) throw new Error("Missing LLM");
  const systemPrompt = SystemPrompts[chatMode];
  const agent = new ToolLoopAgent({
    model: llm(selectedModel?.id),
    instructions: systemPrompt,
    tools: tools as ToolSet, // this shit is needed, but fuck it
    stopWhen: [stepCountIs(DEFAULT_AGENT_STEP_COUNT)], // TODO: Should have no limit mode, so that there aren't pauses
    telemetry: { integrations: [DevToolsTelemetry()] },
  });

  const res = useChat({
    transport: new DirectChatTransport({
      agent: agent,
    })
  })
  res

  return { ...res };
};
