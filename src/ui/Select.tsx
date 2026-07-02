import type { SelectProps } from "@opentui/react";
import { useAtomValue } from "jotai";
import { themeAtom } from "../state/atoms";

export const Select = ({ ...props }: SelectProps) => {
  const theme = useAtomValue(themeAtom);
  return <select selectedTextColor={theme.dark.palette.primary} {...props} />;
};
