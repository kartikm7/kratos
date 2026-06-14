import type { BoxProps } from "@opentui/react";
import { useAtomValue } from "jotai";
import { selectedModelAtom, streamAtom } from "../../state/atoms";

interface DynamicInfoBarProps extends BoxProps {
  loading: boolean;
}

export const DynamicInfoBar = ({
  loading = false,
  ...props
}: DynamicInfoBarProps) => {
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
        {loading && (
          <>
            <spinner name="growHorizontal" color="orange" />
            <text marginLeft={1} fg="grey">
              Streaming... (esc to cancel)
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
