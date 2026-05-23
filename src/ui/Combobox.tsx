import { useEffect, useState } from "react"
import type { SelectOption } from "@opentui/core"
import { useKeyboard, useTerminalDimensions, type BoxProps } from "@opentui/react"

export interface ComboboxProps extends BoxProps {
  placeholder?: string
  options: SelectOption[]
  setSubmitValue: (option: SelectOption | undefined) => void
}

export const Combobox = ({ placeholder = "", options, setSubmitValue, ...props }: ComboboxProps) => {
  const { height } = useTerminalDimensions()
  const [list, setList] = useState(options)
  const [text, setText] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  useKeyboard(key => {
    switch (key.name) {
      case "up":
        setSelectedIndex(idx => Math.max(0, idx - 1))
        break;
      case "down":
        setSelectedIndex(idx => Math.min(idx + 1, list.length - 1))
        break;
      case "return":
        setSubmitValue(list[selectedIndex])
        break;
      default:
        break;
    }
  })

  useEffect(() => {
    const trimmedText = text.trim().toLowerCase()
    setList(() => options.filter(val => {
      return val.name.toLowerCase().includes(trimmedText) || val.description.toLowerCase().includes(trimmedText)
    }))
  }, [text])

  return <box gap={1} height={height * 0.25} {...props}>
    <input onInput={setText} value={text} placeholder={placeholder} focused={true} />
    <select height="100%" options={list} showDescription={false} selectedIndex={selectedIndex} />
  </box>
}

