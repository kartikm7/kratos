import { RGBA, SyntaxStyle } from "@opentui/core"
import "opentui-spinner/react";

interface MarkdownProps {
  content: string,
  streaming: boolean,
  width?: number,
  height?: number
}


export const Markdown = ({ content, streaming, ...props }: MarkdownProps) => {
  const syntaxStyle = SyntaxStyle.fromStyles({
    "markup.heading.1": { fg: RGBA.fromHex("#58A6FF"), bold: true },
    "markup.list": { fg: RGBA.fromHex("#FF7B72") },
    "markup.raw": { fg: RGBA.fromHex("#A5D6FF") },
    default: { fg: RGBA.fromHex("#E6EDF3") },
  })

  return <markdown content={content} syntaxStyle={syntaxStyle} streaming={streaming} {...props} />
}
