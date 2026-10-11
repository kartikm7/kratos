import { useContext } from "react"
import { ChatContext } from "../context/context"

export const useChatContext = () => {
  const chat = useContext(ChatContext)
  if (!chat) throw new Error("ChatContext should be called within the Provider!")
  return chat
}
