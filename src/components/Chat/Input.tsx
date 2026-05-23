import type { InputRenderable } from "@opentui/core"
import { useKeyboard, useTerminalDimensions, type InputProps } from "@opentui/react"
import "opentui-spinner/react"
import { useEffect, useRef, useState } from "react"
import { SlashOptions } from "../Slash/mapping"
import { SlashConnect } from "../Slash/Connect/SlashConnect"
import { useDialog, useDialogState } from "@opentui-ui/dialog/react"

interface CustomInputProps extends InputProps {
  loading?: boolean,
  autocomplete?: boolean
}

export const Input = ({ placeholder = "", autocomplete = true, loading = false, ...props }: CustomInputProps) => {
  const { width } = useTerminalDimensions()
  const [options, setOptions] = useState(SlashOptions)
  const [index, setIndex] = useState(0)
  const [isSlashTriggered, setSlashTriggered] = useState(false)
  const dialog = useDialog()
  const dialogOpen = useDialogState(s => s.isOpen)
  const ref = useRef<InputRenderable>(null)

  useEffect(() => {
    if (props.value?.trim().startsWith("/")) {
      setSlashTriggered(true)
      const actualText = props.value.slice(1)
      setOptions(pre => {
        const filtered = pre.filter(val => {
          return val.name.includes(actualText) || val.description.includes(actualText)
        })
        return filtered
      })
    } else {
      setSlashTriggered(false)
      setOptions(SlashOptions)
    }
    return () => {
      setSlashTriggered(false)
      setOptions(SlashOptions)
    }
  }, [props.value])

  useKeyboard((key) => {
    switch (key.name) {
      case "up":
        if (isSlashTriggered) setIndex(idx => idx == 0 ? options.length - 1 : Math.max(0, idx - 1))
        break;
      case "down":
        if (isSlashTriggered) setIndex(idx => idx == options.length - 1 ? 0 : Math.min(idx + 1, options.length - 1))
        break;
      case "return":
        // this is actually the submit state
        if (isSlashTriggered) {
          props.onSubmit = () => { } // because we can't submit an empty function?
          handleSelectionSubmit()
        }
        break;
      default:
        if (dialogOpen) break
        break;
    }
  })

  const handleSelectionSubmit = () => {
    const selection = options[index]
    if (!selection) return
    if (!options.includes(selection)) return

    // setting states back to initial values
    if (ref.current) ref.current.value = ""
    setIndex(0)

    switch (selection.name) {
      case "/connect":
        SlashConnect(dialog)
        break;
      case "/model":
        break;
      default:
        break;
    }
  }

  return <box flexDirection="column" columnGap={2}>
    {autocomplete && isSlashTriggered && <select options={options} selectedIndex={index} width={width} height={options.length * 2} />}
    <box border borderStyle="single" width={width} paddingX={1} >
      {loading ? <spinner name="dots" /> : <></>}
      <input ref={ref} placeholder={placeholder} focused={true} {...props} />
    </box >

  </box>
}
