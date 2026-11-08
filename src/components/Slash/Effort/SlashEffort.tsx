import { useDialog, type DialogActions } from "@opentui-ui/dialog/react";
import { useToast } from "../../../hooks/useToast";
import { DialogHeader, DialogRoot } from "../../../ui/Dialog";
import { Combobox } from "../../../ui/Combobox";
import { updatePreferences } from "../../../utils/preferences";
import type { SelectOption } from "@opentui/core";
import { useSetAtom } from "jotai";
import { preferencesAtom } from "../../../state/atoms";

const SlashEffortDialog = () => {
  const dialog = useDialog();
  const { toast } = useToast();
  const setPreferences = useSetAtom(preferencesAtom)

  const handleSubmit = (comboxboxValue: SelectOption | undefined) => {
    try {
      if (!comboxboxValue) throw new Error('')
      const { value: effort } = comboxboxValue
      if (!effort.trim()) {
        toast.error("Chat title cannot be empty");
        return;
      }
      setPreferences(pre => {
        return { ...pre, effort }
      })
      updatePreferences("effort", effort)
      toast.success("Chat renamed successfully!");
      dialog.closeAll();
    } catch (error) {
      toast.error(`Something went wrong ${error}`);
      console.log("Something went wrong", error);
    }
  };

  const options = [
    {
      "name": "provider-default",
      "value": "provider-default",
      "description": "Use the provider's default reasoning behavior (default when omitted)."
    },
    {
      "name": "none",
      "value": "none",
      "description": "Disable reasoning (lowest reasoning level if it cannot be disabled)."
    },
    {
      "name": "minimal",
      "value": "minimal",
      "description": "Bare-minimum reasoning."
    },
    {
      "name": "low",
      "value": "low",
      "description": "Fast, concise reasoning."
    },
    {
      "name": "medium",
      "value": "medium",
      "description": "Balanced reasoning."
    },
    {
      "name": "high",
      "value": "high",
      "description": "Thorough reasoning."
    },
    {
      "name": "xhigh",
      "value": "xhigh",
      "description": "Extra-high reasoning."
    },
    {
      "name": "max",
      "value": "max",
      "description": "Maximum reasoning."
    }
  ]

  return (
    <DialogRoot>
      <DialogHeader>Model Effort</DialogHeader>
      <Combobox
        onSubmit={handleSubmit}
        showDescription
        placeholder="effort"
        options={options}
      />
      <text>
        enter <span style={{ fg: "grey" }}>submit</span>
      </text>
    </DialogRoot>
  );
};

export const SlashEffort = (dialog: DialogActions) => {
  dialog.show({ content: () => <SlashEffortDialog /> });
};
