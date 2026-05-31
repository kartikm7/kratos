import type { FilePart, ModelMessage, TextPart } from "ai";
import { Markdown } from "../../../ui/Markdown";
import { useTerminalDimensions } from "@opentui/react";
import type {
  ReasoningPart,
  ToolApprovalRequest,
  ToolCallPart,
  ToolResultPart,
} from "@ai-sdk/provider-utils";
import { TextAttributes } from "@opentui/core";
import { useEffect } from "react";

type MessagesProps = {
  messages: ModelMessage[];
};

export const Messages = ({ messages }: MessagesProps) => {
  useEffect(() => {
    console.log(messages);
  }, [messages]);
  return (
    <box gap={1}>
      {messages.map((val, idx) => {
        return <MessageFactory val={val} idx={idx} />;
      })}
    </box>
  );
};

// this just renders based on the matching Message type
function MessageFactory({ val, idx }: { val: ModelMessage; idx: number }) {
  const { width } = useTerminalDimensions();

  if (typeof val.content == "string") {
    return (
      <box backgroundColor="orange">
        <Markdown
          content={val.content}
          streaming={false}
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
    return content.map((inner, innerIdx) => {
      switch (inner.type) {
        case "reasoning":
          return (
            <box border={["left"]} paddingX={1} key={innerIdx}>
              <text attributes={TextAttributes.ITALIC | TextAttributes.DIM}>
                {inner.type}
              </text>
              <Markdown content={inner.text} streaming={false} width={width} />
            </box>
          );
        case "text":
          return (
            <Markdown
              key={innerIdx}
              content={inner.text}
              streaming={false}
              width={width}
            />
          );
        case "tool-call":
          return (
            <box border={["left"]} paddingX={1} key={innerIdx}>
              <text attributes={TextAttributes.ITALIC | TextAttributes.DIM}>
                {inner.type}
              </text>
              <text>{inner.toolName}</text>
            </box>
          );
        case "tool-result":
          return (
            <box border={["left"]} paddingX={1} key={innerIdx}>
              <text attributes={TextAttributes.ITALIC | TextAttributes.DIM}>
                {inner.type}
              </text>
              <text>
                {typeof inner.output == "string"
                  ? inner.output
                  : JSON.stringify(inner.output)}
              </text>
            </box>
          );
        default:
          break;
      }
    });
  }
}
