import { type BoxProps } from "@opentui/react";
import { useContext } from "react";
import { DimensionsContext } from "../context/context";

export const RootLayout = ({ children, ...props }: BoxProps) => {
  return (
    <box alignItems="center" justifyContent="center" flexGrow={1} {...props}>
      {children}
    </box>
  );
};

export const ChatLayout = ({ children, ...props }: BoxProps) => {
  const { height } = useContext(DimensionsContext);
  return (
    <box justifyContent="space-between" height={height} paddingY={1} {...props}>
      {children}
    </box>
  );
};
