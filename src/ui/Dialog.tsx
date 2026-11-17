import type { BoxProps } from "@opentui/react";
import { useAtomValue } from "jotai";
import { themeAtom } from "../state/atoms";
import { DialogProvider } from "@opentui-ui/dialog/react";
import type { PropsWithChildren } from "react";

const DialogRoot = (props: BoxProps) => {
  return (
    <box gap={props.gap || 1} padding={props.padding || 1} {...props}>
      {props.children}
    </box>
  );
};

const DialogHeader = (props: BoxProps) => {
  const theme = useAtomValue(themeAtom);
  return (
    <box flexDirection="row" justifyContent="space-between" {...props}>
      <text style={{ fg: theme.dark.palette.primary }}>{props.children}</text>
      <text style={{ fg: theme.dark.palette.ink, opacity: 0.8 }}>esc</text>
    </box>
  );
};

const AppDialogs = ({ children }: PropsWithChildren) => {
  const theme = useAtomValue(themeAtom);
  return (
    <DialogProvider
      backdropOpacity={0}
      dialogOptions={{
        style: {
          border: true,
          borderStyle: "rounded",
          borderColor: theme.dark.palette.primary,
          backgroundColor: theme.dark.palette.neutral,
        },
      }}
    >
      {children}
    </DialogProvider>
  );
};

export { DialogRoot, DialogHeader, AppDialogs };
