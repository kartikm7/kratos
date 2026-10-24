import type { BoxProps } from "@opentui/react";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { themeAtom, toastAtom } from "../state/atoms";

interface ToasterProps extends BoxProps {} // no need to define the extended props for now

// I didn't know that, when the component is once mounted, it only ever re-mounts
// in the following situations:
// 1. condtional render
// 2. if they key prop is changed
//
// I was under the impression that, the components re-mount on every useEffect side-effect
// but I was completely wrong, it only diffs what's changed rest remains as is
// which makes complete sense
export const Toaster = ({...props}: ToasterProps) => {
  const toast = useAtomValue(toastAtom)
  const [visible, setVisibility] = useState(true)
  const theme = useAtomValue(themeAtom);

  // nothing is setting it true again, that's the big problem
  useEffect(()=>{
    if(!toast) return // we don't require calling timer when toast is not populated
    setVisibility(true) // nothing sets it true again hence this
    const timer = setTimeout(()=> {
      setVisibility(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [toast?.message])

  if(!toast) return
  return visible && <box position="absolute" top={2} right={2} padding={1} borderColor={theme.dark.palette[toast.type]}  {...props}><text>{toast.message} </text></box>
}
