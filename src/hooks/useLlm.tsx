import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { chatModeAtom, llmAtom, selectedModelAtom } from "../state/atoms";
import {
  DirectChatTransport,
  readUIMessageStream,
  stepCountIs,
  tool,
  ToolLoopAgent,
  toUIMessageStream,
  type ToolSet,
  type UIMessage,
} from "ai";
import { SubAgentPrompt, SystemPrompts } from "../utils/prompts";
import { DEFAULT_AGENT_STEP_COUNT } from "../utils/constants";
import { DevToolsTelemetry } from "@ai-sdk/devtools";
import { getModeSpecificTools } from "../utils/tools/tools";
import { useChat, type UseChatHelpers } from "@ai-sdk/react";
import { useDb } from "./useDb";
import { z } from "zod/v4";

export type UseLLM = UseChatHelpers<UIMessage<any, never>>;

export const useLlm = (): UseLLM => {
  const [llm, setLlm] = useAtom(llmAtom);
  const chatMode = useAtomValue(chatModeAtom);
  const { appendToChat } = useDb();
  let tools = getModeSpecificTools(chatMode);
  const selectedModel = useAtomValue(selectedModelAtom);
  const subModel = selectedModel;

  const subAgent = new ToolLoopAgent({
    model: llm(subModel?.id),
    instructions: SubAgentPrompt,
    tools: tools as ToolSet, // this shit is needed, but fuck it
    stopWhen: [stepCountIs(DEFAULT_AGENT_STEP_COUNT)], // TODO: Should have no limit mode, so that there aren't pauses
  });

  const subAgentTool = tool({
    title: "SubAgent",
    inputSchema: z.object({
      task: z.string().describe("The task to complete"),
    }),
    execute: async function* ({ task }, { abortSignal }) {
      const result = await subAgent.stream({
        prompt: task,
        abortSignal, // Cancels subagent if main request is aborted
      });

      for await (const message of readUIMessageStream({
        stream: toUIMessageStream({ stream: result.stream }),
      })) {
        yield message;
      }
    },
    toModelOutput: ({ output: message }) => {
      const lastPart = message?.parts.findLast((val) => val.type === "text");
      return {
        type: "text",
        value:
          lastPart?.text ??
          "Completed but didn't return text (call out to user)",
      };
    },
  });
  const systemPrompt = SystemPrompts[chatMode];
  if (chatMode === "build") tools = { subAgentTool, ...tools } as ToolSet;

  // no model selected yet -> keep the app usable, error only when a message is sent
  const transport = llm
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
