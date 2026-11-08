import { useDialog, type DialogActions } from "@opentui-ui/dialog/react";
import { useAtomValue } from "jotai";
import { themeAtom } from "../../state/atoms";
import { DialogHeader, DialogRoot } from "../../ui/Dialog";
import { AccentText } from "../../ui/AccentText";
import { SecondaryText } from "../../ui/SecondaryText";
import { Separator } from "../../ui/Separator";
import { SlashOptions } from "../Slash/mapping";
import { useContext } from "react";
import { DimensionsContext } from "../../context/context";

interface Shortcut {
  keys: string;
  description: string;
}

interface ShortcutSection {
  title: string;
  shortcuts: Shortcut[];
}

const ShortcutSections: ShortcutSection[] = [
  {
    title: "Global",
    shortcuts: [
      { keys: "ctrl+o", description: "toggle collapse" },
      { keys: "f1", description: "show the help dialog" },
      { keys: "f12", description: "toggle the console" },
    ],
  },
  {
    title: "Input",
    shortcuts: [
      { keys: "return", description: "submit the prompt" },
      { keys: "shift+return", description: "insert a newline" },
      { keys: "ctrl+return", description: "insert a newline" },
      { keys: "ctrl+u", description: "delete the current line" },
      { keys: "ctrl+z", description: "undo" },
      { keys: "ctrl+meta+z", description: "redo" },
      { keys: "up / down", description: "navigate the slash autocomplete" },
      { keys: "return", description: "select from the slash autocomplete" },
    ],
  },
  {
    title: "Chat",
    shortcuts: [
      { keys: "arrows / j·k", description: "scroll the conversation" },
      { keys: "shift+tab", description: "cycle mode (build / discuss / court)" },
      { keys: "esc", description: "stop streaming" },
    ],
  },
  {
    title: "Dialogs",
    shortcuts: [
      { keys: "arrows / j·k", description: "scroll the help dialog" },
      { keys: "esc", description: "close the dialog" },
      { keys: "tab", description: "cycle between fields" },
    ],
  },
  {
    title: "Slash Commands",
    shortcuts: SlashOptions.map((option) => {
      return { keys: option.name, description: option.description };
    }),
  },
];

const HelpDialogContent = () => {
  const theme = useAtomValue(themeAtom);
  const { height } = useContext(DimensionsContext);

  return (
    <DialogRoot>
      <DialogHeader>Help</DialogHeader>
      <scrollbox
        height={Math.round(height * 0.6)}
        scrollbarOptions={{ buffered: true }}
        contentOptions={{ gap: 2 }}
        focused={true}
      >
        {ShortcutSections.map((section, index) => {
          return (
            <box flexDirection="column" gap={1}>
              {index > 0 && <Separator />}
              <AccentText>{section.title}</AccentText>
              {section.shortcuts.map((shortcut) => {
                return (
                  <box flexDirection="row" columnGap={2}>
                    <text style={{ fg: theme.dark.palette.primary }}>
                      {shortcut.keys}
                    </text>
                    <SecondaryText>{shortcut.description}</SecondaryText>
                  </box>
                );
              })}
            </box>
          );
        })}
      </scrollbox>
      <text>
        esc <span style={{ fg: "grey" }}>close</span>
      </text>
    </DialogRoot>
  );
};

export const HelpDialog = (dialog: DialogActions) => {
  dialog.show({ content: () => <HelpDialogContent /> });
};
