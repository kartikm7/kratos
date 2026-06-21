import { type BoxProps } from "@opentui/react";
import { capitalise } from "../../../utils/string";
import { TextAttributes } from "@opentui/core";
import { useAtomValue } from "jotai";
import { collapseAtom, themeAtom } from "../../../state/atoms";

interface SupportBlockProps extends BoxProps {
  title: string;
  content: string;
}

export const SupportBlock = ({
  title,
  content,
  children,
  ...props
}: SupportBlockProps) => {
  const collapse = useAtomValue(collapseAtom);
  const theme = useAtomValue(themeAtom);
  return (
    <box {...props}>
      <text
        attributes={TextAttributes.ITALIC}
        fg={theme.dark.palette.ink}
        content={capitalise(title) || ""}
        opacity={0.75}
      />
      {!collapse && (
        <>
          <text content={content} fg={theme.dark.palette.ink} opacity={0.75} />
          <box
            border={["bottom"]}
            borderColor={theme.dark.palette.ink}
            opacity={0.75}
          />
        </>
      )}
    </box>
  );
};
