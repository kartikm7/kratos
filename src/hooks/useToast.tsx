import { useSetAtom } from "jotai"
import { toastAtom } from "../state/atoms"

export const useToast = () => {
  const setToast = useSetAtom(toastAtom)
  
  const toast = {
    success: (message: string) => setToast({message, type: "success"}),
    error: (message: string) => setToast({message, type: "error"}),
    info: (message: string) => setToast({message, type: "info"}),
  }

  return {toast}
}
