import { fg } from "@opentui/core";
import type { TextProps } from "@opentui/react";
import { useAtomValue } from "jotai";
import { themeAtom } from "../state/atoms";

export const AccentText = ({ ...props }: TextProps) => {
  const theme = useAtomValue(themeAtom);
  return <text style={{ fg: theme.dark.palette.accent }} {...props} />;
};
