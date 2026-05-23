import type { BoxProps } from "@opentui/react"

const DialogRoot = (props: BoxProps) => {
  return <box gap={props.gap || 1} padding={props.padding || 1}  {...props}>{props.children}</box>
}

const DialogHeader = (props: BoxProps) => {
  return <box flexDirection="row" justifyContent="space-between" {...props}>
    <text>{props.children}</text>
    <text fg="grey" >esc</text>
  </box>
}

export { DialogRoot, DialogHeader }
