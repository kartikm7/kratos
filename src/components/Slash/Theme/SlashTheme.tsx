import { useDialog, type DialogActions } from "@opentui-ui/dialog/react";
import { useToast } from "../../../hooks/useToast";
import { DialogHeader, DialogRoot } from "../../../ui/Dialog";
import { Combobox } from "../../../ui/Combobox";
import { updatePreferences } from "../../../utils/preferences";
import type { SelectOption } from "@opentui/core";
import { useSetAtom } from "jotai";
import { preferencesAtom, themeAtom } from "../../../state/atoms";
import { themeRegistry } from "../../../themes";
import type { Theme } from "../../../themes/types";

const SlashThemeDialog = () => {
  const dialog = useDialog();
  const { toast } = useToast();
  const setPreferences = useSetAtom(preferencesAtom);
  const setTheme = useSetAtom(themeAtom);

  const handleSubmit = (comboxboxValue: SelectOption | undefined) => {
    try {
      if (!comboxboxValue) throw new Error('')
      const { value: theme } = comboxboxValue
      if (!theme.trim()) {
        toast.error("Theme cannot be empty");
        return;
      }
      setTheme(themeRegistry[theme] as Theme)
      setPreferences(pre => {
        return { ...pre, theme }
      })
      updatePreferences("theme", theme)
      toast.success("Theme set successfully!");
      dialog.closeAll();
    } catch (error) {
      toast.error(`Something went wrong ${error}`);
      console.log("Something went wrong", error);
    }
  };

  const options = Object.entries(themeRegistry).map(([name, theme]) => {
    return {
      name: theme.name,
      value: name,
      description: `switch to the ${theme.name} theme`,
    };
  });

  return (
    <DialogRoot>
      <DialogHeader>Theme</DialogHeader>
      <Combobox
        onSubmit={handleSubmit}
        showDescription
        placeholder="theme"
        options={options}
      />
      <text>
        enter <span style={{ fg: "grey" }}>submit</span>
      </text>
    </DialogRoot>
  );
};

export const SlashTheme = (dialog: DialogActions) => {
  dialog.show({ content: () => <SlashThemeDialog /> });
};
