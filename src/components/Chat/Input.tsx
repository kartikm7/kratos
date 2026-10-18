import type { InputRenderable, TextareaRenderable } from "@opentui/core";
import {
  useKeyboard,
  type InputProps,
  type TextareaProps,
} from "@opentui/react";
import "opentui-spinner/react";
import { useContext, useEffect, useRef, useState } from "react";
import { SlashOptions } from "../Slash/mapping";
import { SlashConnect } from "../Slash/Connect/SlashConnect";
import { useDialog, useDialogState } from "@opentui-ui/dialog/react";
import { SlashModel } from "../Slash/Model/SlashModel";
import { useAtomValue, useSetAtom } from "jotai";
import { chatIdAtom, themeAtom } from "../../state/atoms";
import { Select } from "../../ui/Select";
import { DimensionsContext } from "../../context/context";
import { useRefreshModelsJson } from "../../hooks/useRefreshModelsJson";
import { useChatContext } from "../../hooks/useChatContext";
import { SlashResume } from "../Slash/Resume/SlashResume";

interface CustomInputProps extends TextareaProps {
  loading?: boolean;
  autocomplete?: boolean;
  onTextChange: (text: string) => void;
}

export const Input = ({
  placeholder = "",
  autocomplete = true,
  loading = false,
  onSubmit = () => {},
  ...props
}: CustomInputProps) => {
  const { width } = useContext(DimensionsContext);
  const [options, setOptions] = useState(SlashOptions);
  const [index, setIndex] = useState(0);
  const [isSlashTriggered, setSlashTriggered] = useState(false);
  const dialog = useDialog();
  const dialogOpen = useDialogState((s) => s.isOpen);
  const ref = useRef<TextareaRenderable>(null);
  const theme = useAtomValue(themeAtom);
  const setChatId = useSetAtom(chatIdAtom);
  const { setMessages } = useChatContext();
  const { fetchAndSetModelsList } = useRefreshModelsJson();

  useEffect(() => {
    if (ref.current?.plainText.trim().startsWith("/")) {
      setSlashTriggered(true);
      const actualText = ref.current?.plainText.slice(1);
      setOptions((pre) => {
        const filtered = pre.filter((val) => {
          return (
            val.name.includes(actualText) ||
            val.description.includes(actualText)
          );
        });
        return filtered;
      });
    } else {
      setSlashTriggered(false);
      setOptions(SlashOptions);
    }
    return () => {
      setSlashTriggered(false);
      setOptions(SlashOptions);
    };
  }, [ref.current?.plainText]);

  useKeyboard((key) => {
    switch (key.name) {
      case "up":
        if (isSlashTriggered)
          setIndex((idx) =>
            idx == 0 ? options.length - 1 : Math.max(0, idx - 1),
          );
        break;
      case "down":
        if (isSlashTriggered)
          setIndex((idx) =>
            idx == options.length - 1
              ? 0
              : Math.min(idx + 1, options.length - 1),
          );
        break;
      case "return":
        // this is actually the submit state
        if (isSlashTriggered) {
          onSubmit = () => {}; // because we can't submit an empty function?
          handleSelectionSubmit();
        }
        break;
      default:
        if (dialogOpen) break;
        break;
    }
  });

  const handleSelectionSubmit = () => {
    const selection = options[index];
    if (!selection) return;
    if (!options.includes(selection)) return;

    // setting states back to initial values
    if (ref.current) ref.current.clear();
    setIndex(0);

    switch (selection.name) {
      case "/connect":
        SlashConnect(dialog);
        break;
      case "/model":
        SlashModel(dialog);
        break;
      case "/resume-chat":
        SlashResume(dialog);
        break;
      case "/refresh-models":
        fetchAndSetModelsList({ forceRefresh: true, successToast: true });
        break;
      case "/clear":
        // I hate this, the handling is so all over the place. But for now we good.
        setChatId(undefined);
        setMessages(() => []);
        break;
      default:
        break;
    }
  };

  return (
    <box
      flexDirection="column"
      columnGap={2}
      position="relative"
      height="100%"
      justifyContent="flex-end"
    >
      {autocomplete && isSlashTriggered && (
        <Select
          position="absolute"
          bottom="100%"
          zIndex={1}
          options={options}
          selectedIndex={index}
          width={width}
          height={options.length * 2}
          backgroundColor={theme.dark.palette.neutral}
        />
      )}
      <box
        border
        borderStyle="single"
        borderColor="grey"
        width={width}
        paddingX={1}
      >
        <textarea
          ref={ref}
          placeholder={placeholder}
          overflow="scroll"
          minHeight={1}
          maxHeight={3}
          onContentChange={() => {
            props.onTextChange(ref.current?.plainText || "");
          }}
          onSubmit={() => {
            ref.current?.clear();
            if (onSubmit) onSubmit();
          }}
          keyBindings={[
            { name: "return", ctrl: false, action: "submit" },
            { name: "return", shift: true, action: "newline" }, // Fucking hell Windows, does not send shift + enter event
            { name: "return", ctrl: true, action: "newline" },
            { name: "U", ctrl: true, action: "delete" },
            { name: "z", ctrl: true, action: "undo" },
            { name: "z", ctrl: true, meta: true, action: "redo" },
          ]}
          {...props}
        />
      </box>
    </box>
  );
};
