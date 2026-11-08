import { useDialog, useDialogState } from "@opentui-ui/dialog/react";
import { useKeyboard } from "@opentui/react";
import { HelpDialog } from "./HelpDialog";

// useDialog() only works within the DialogProvider, so f1 lives in its own
// component inside the provider (same way Input.tsx grabs the dialog actions)
export const HelpShortcut = () => {
  const dialog = useDialog();
  const dialogOpen = useDialogState((s) => s.isOpen);

  useKeyboard((key) => {
    if (dialogOpen) return;
    if (key.name == "f1") {
      HelpDialog(dialog);
    }
  });

  return null;
};
