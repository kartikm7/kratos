import type { SelectOption } from "@opentui/core"
import { useKeyboard, useTerminalDimensions, type InputProps } from "@opentui/react"
import "opentui-spinner/react"
import { act, useEffect, useState } from "react"
import { SlashOptions } from "../Slash/mapping"

interface CustomInputProps extends InputProps {
  loading?: boolean,
  autocomplete?: boolean
}

export const Input = ({ placeholder = "", autocomplete = true, loading = false, ...props }: CustomInputProps) => {
  const { width } = useTerminalDimensions()
  const [selection, setSelection] = useState<SelectOption | null>()
  const [options, setOptions] = useState(SlashOptions)
  const [index, setIndex] = useState(0)
  const [inputFocused, setInputFocused] = useState(true)
  const [selectFocused, setSelectFocused] = useState(false)
  const [isSlashTriggered, setSlashTriggered] = useState(false)

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
        if (isSlashTriggered && inputFocused) {
          setIndex(options.length - 1)
          setSelection(options[options.length - 1])
          setSelectFocused(true)
          setInputFocused(false)
        }
        break;
      case "down":
        if (isSlashTriggered && inputFocused) return
        break;
      case "return":
        // this is actually the submit state
        if (isSlashTriggered && selectFocused) {
          props.onSubmit = () => { } // because we can't submit an empty function?
          handleSelectionSubmit()
        }
        break;
      default:
        setSelectFocused(false)
        setInputFocused(true)
        break;
    }
  })

  const handleSelectionSubmit = () => {
    if (!selection) return
    if (!options.includes(selection)) return
  }

  return <box flexDirection="column" columnGap={2}>
    {autocomplete && isSlashTriggered && <select onChange={(_idx, option) => setSelection(option)} options={options} selectedIndex={index} width={width} focused={selectFocused} height={options.length * 2} />}
    <box border borderStyle="single" width={width} paddingX={1} >
      {loading ? <spinner name="dots" /> : <></>}
      <input placeholder={placeholder} focused={inputFocused} {...props} />
    </box >

  </box>
}
