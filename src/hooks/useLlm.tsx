import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  chatModeAtom,
  llmAtom,
  selectedModelAtom,
  streamAtom,
  // toolsAtom,
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
import type { AiMessage, MessageStream, Model } from "../state/types";
import { useKeyboard } from "@opentui/react";
import { DEFAULT_AGENT_STEP_COUNT } from "../utils/constants";
import { DevToolsTelemetry } from '@ai-sdk/devtools';
import { getModeSpecificTools } from "../utils/tools/tools";
import { readAuth } from "../utils/auth";
import { readSelectedModel } from "../utils/preferences";
import { createModel } from "../utils/models";

export const useLlm = () => {
  const [llm, setLlm] = useAtom(llmAtom);
  const chatMode = useAtomValue(chatModeAtom);
  const tools = getModeSpecificTools(chatMode)
  const selectedModel = useAtomValue(selectedModelAtom)
  let abortController = new AbortController();



  // useKeyboard((key) => {
  //   if (key.name == "escape") {
  //     if (ref.current) ref.current.abort("userCancelled");
  //   }
  // });

  if (!llm) throw new Error("Missing LLM");
  const systemPrompt = SystemPrompts[chatMode];
  const agent = new ToolLoopAgent({
    model: llm(selectedModel?.id),
    instructions: systemPrompt,
    tools: tools as ToolSet, // this shit is needed, but fuck it
    stopWhen: [stepCountIs(DEFAULT_AGENT_STEP_COUNT)], // TODO: Should have no limit mode, so that there aren't pauses
    telemetry: { integrations: [DevToolsTelemetry()] },
  });


  return { agent };
};
