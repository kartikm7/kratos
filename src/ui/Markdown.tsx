import { RGBA, SyntaxStyle } from "@opentui/core";
import { useAtomValue } from "jotai";
import "opentui-spinner/react";
import { themeAtom } from "../state/atoms";

interface MarkdownProps {
  content: string;
  streaming: boolean;
  width?: number;
  height?: number;
}

export const Markdown = ({ content, streaming, ...props }: MarkdownProps) => {
  const theme = useAtomValue(themeAtom);
  const syntaxStyle = SyntaxStyle.fromStyles({
    "markup.heading.1": {
      fg: RGBA.fromHex(theme.dark.palette.primary),
      bold: true,
    },
    "markup.list": { fg: RGBA.fromHex(theme.dark.palette.accent) },
    "markup.raw": { fg: RGBA.fromHex("#A5D6FF") },
    default: { fg: RGBA.fromHex(theme.dark.palette.ink) },
    keyword: {
      fg: RGBA.fromHex(theme.dark.overrides["syntax-keyword"]),
      bold: true,
    },
    string: { fg: RGBA.fromHex(theme.dark.overrides["syntax-string"]) },
    comment: {
      fg: RGBA.fromHex(theme.dark.overrides["syntax-comment"]),
      italic: true,
    },
    property: { fg: RGBA.fromHex(theme.dark.overrides["syntax-property"]) },
    variable: { fg: RGBA.fromHex(theme.dark.overrides["syntax-variable"]) },
    constant: {
      fg: RGBA.fromHex(theme.dark.overrides["syntax-constant"]),
      bold: true,
    },
    type: { fg: RGBA.fromHex(theme.dark.overrides["syntax-type"]) },
    class: { fg: RGBA.fromHex(theme.dark.overrides["syntax-object"]) },
    punctuation: {
      fg: RGBA.fromHex(theme.dark.overrides["syntax-punctuation"]),
    },
  });

  return (
    <markdown
      content={content}
      syntaxStyle={syntaxStyle}
      streaming={streaming}
      internalBlockMode="coalesced"
      {...props}
    />
  );
};
