import type { BoxProps } from "@opentui/react";
import { useAtomValue } from "jotai";
import { themeAtom } from "../state/atoms";

export const Separator = ({ ...props }: BoxProps) => {
  const theme = useAtomValue(themeAtom);
  return (
    <box
      style={{
        border: ["bottom"],
        borderColor: theme.dark.palette.ink,
        opacity: 0.8,
      }}
      {...props}
    />
  );
};
