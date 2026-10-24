import type { BoxProps } from "@opentui/react";
import { useAtomValue } from "jotai";
import { chatModeAtom, selectedModelAtom, themeAtom } from "../../state/atoms";
import { AccentText } from "../../ui/AccentText";
import { capitalise } from "../../utils/string";

interface DynamicInfoBarProps extends BoxProps {
  loading: boolean;
}

export const DynamicInfoBar = ({
  loading = false,
  ...props
}: DynamicInfoBarProps) => {
  const selectedModel = useAtomValue(selectedModelAtom);
  const theme = useAtomValue(themeAtom);
  const chatMode = useAtomValue(chatModeAtom);
  const modeColor = (() => {
    switch (chatMode) {
      case "build":
        return theme.dark.palette.accent;
      case "discuss":
        return theme.dark.palette.info;
      case "court":
        return theme.dark.palette.error;
      default:
        break;
    }
  })();
  return (
    <box
      paddingX={1}
      flexDirection="row"
      justifyContent="space-between"
      width="100%"
      {...props}
    >
      <box alignItems="center" flexDirection="row">
        <text bg={modeColor} content={" " + capitalise(chatMode) + " "} />
        {loading && (
          <>
            <spinner name="growHorizontal" color={modeColor} />
            <text marginLeft={1} fg="grey">
              Streaming... (esc to cancel)
            </text>
          </>
        )}
      </box>
      <box>
        <AccentText opacity={selectedModel ? 1 : 0.5}>
          {selectedModel?.id || "Model not found (use /model)"}
        </AccentText>
      </box>
    </box>
  );
};
