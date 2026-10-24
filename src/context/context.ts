import { createContext } from "react";
import type { UseLLM } from "../hooks/useLlm";

export const DimensionsContext = createContext({ width: 0, height: 0 })
export const ChatContext = createContext<UseLLM | null>(null)
