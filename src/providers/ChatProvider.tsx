import type { ProviderProps, ReactNode } from "react";
import { useLlm } from "../hooks/useLlm";
import { ChatContext } from "../context/context";

interface ChatPropviderProps {
  children: ReactNode
}

export const ChatProvider = ({ children }: ChatPropviderProps) => {
  const res = useLlm()
  return <ChatContext.Provider value={{ ...res }}>
    {children}
  </ChatContext.Provider>
}
