import type { FilePart, ModelMessage, TextPart } from "ai";
import { Markdown } from "../../../ui/Markdown";
import { useTerminalDimensions } from "@opentui/react";
import type {
  ReasoningPart,
  ToolCallPart,
  ToolResultPart,
} from "@ai-sdk/provider-utils";
import { useAtomValue } from "jotai";
import { themeAtom } from "../../../state/atoms";
import { SupportBlock } from "./SupportBlock";

type MessagesProps = {
  messages: ModelMessage[];
  streaming?: boolean;
};

export const Messages = ({ messages, streaming = false }: MessagesProps) => {
  // useEffect(() => {
  //   console.log(messages);
  // }, [messages]);
  return (
    <box gap={1} marginTop={streaming ? 1 : 0}>
      {messages.map((val, idx) => {
        return <MessageFactory val={val} idx={idx} streaming={streaming} />;
      })}
    </box>
  );
};

// this just renders based on the matching Message type
function MessageFactory({
  val,
  idx,
  streaming = false,
}: {
  val: ModelMessage;
  idx: number;
  streaming: boolean;
}) {
  const { width } = useTerminalDimensions();
  const theme = useAtomValue(themeAtom);

  if (typeof val.content == "string") {
    return (
      <box
        backgroundColor={theme?.dark.palette.accent}
        flexDirection="row"
        gap={2}
        paddingX={1}
      >
        <text content=">" />
        <Markdown
          content={val.content}
          streaming={streaming}
          width={width}
          key={idx}
        />
      </box>
    );
  } else {
    // const content = val.content as Array<TextPart | FilePart | ReasoningPart | ToolCallPart | ToolResultPart | ToolApprovalRequest>
    const content = val.content as Array<
      TextPart | ReasoningPart | ToolCallPart | ToolResultPart
    >;
    return (
      <box paddingX={1}>
        {content.map((inner, innerIdx) => {
          switch (inner.type) {
            case "reasoning":
              return (
                <SupportBlock
                  title={inner.type}
                  content={inner.text}
                  key={innerIdx}
                />
              );
            case "text":
              return (
                <Markdown
                  key={innerIdx}
                  content={inner.text}
                  streaming={streaming}
                  width={width}
                />
              );
            // This points to the TODO regarding tool-call in useLlm.tsx
            // case "tool-call":
            //   return (
            //     <box border={["left"]} paddingX={1} key={innerIdx}>
            //       <text attributes={TextAttributes.ITALIC | TextAttributes.DIM}>
            //         {inner.type}
            //       </text>
            //       <text>{inner.toolName}</text>
            //     </box>
            //   );
            case "tool-result":
              return (
                <SupportBlock
                  title={inner.toolName}
                  content={
                    typeof inner.output == "string"
                      ? inner.output
                      : JSON.stringify(inner.output)
                  }
                  key={innerIdx}
                />
              );
            default:
              break;
          }
        })}
      </box>
    );
  }
}
