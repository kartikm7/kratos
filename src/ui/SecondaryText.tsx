import type { TextProps } from "@opentui/react";
import { useAtomValue } from "jotai";
import { themeAtom } from "../state/atoms";

export const SecondaryText = ({ ...props }: TextProps) => {
  const theme = useAtomValue(themeAtom);
  return (
    <text style={{ fg: theme.dark.palette.ink, opacity: 0.8 }} {...props} />
  );
};
