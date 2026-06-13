import type { BoxProps } from "@opentui/react";
import { useAtomValue } from "jotai";
import { selectedModelAtom, streamAtom } from "../../state/atoms";

export const StaticInfoBar = ({ ...props }: BoxProps) => {
  const stream = useAtomValue(streamAtom);
  const selectedModel = useAtomValue(selectedModelAtom);
  return (
    <box
      paddingX={1}
      flexDirection="row"
      justifyContent="space-between"
      width="100%"
      {...props}
    >
      <box alignItems="center" flexDirection="row">
        {stream.length > 0 && (
          <>
            <spinner name="growHorizontal" color="orange" />
            <text marginLeft={1} fg="grey">
              Streaming...
            </text>
          </>
        )}
      </box>
      <box>
        <text fg="orange" opacity={selectedModel ? 1 : 0.5}>
          {selectedModel?.id || "Model not found (use /model)"}
        </text>
      </box>
    </box>
  );
};
