import { isToolUIPart, type UIDataTypes, type UIMessage, type UIMessagePart, type UITools } from "ai";
import { Markdown } from "../../../ui/Markdown";
import { useTerminalDimensions } from "@opentui/react";
import { useAtomValue } from "jotai";
import { themeAtom } from "../../../state/atoms";
import { SupportBlock } from "./SupportBlock";

type MessagesProps = {
  messages: UIMessage[];
  streaming?: boolean;
};

export const Messages = ({ messages, streaming = false }: MessagesProps) => {
  const theme = useAtomValue(themeAtom);
  return (
    <box gap={1}>
      {messages.map((msg) => {
        const isUser = msg.role == "user"
        return <box key={msg.id} backgroundColor={isUser ? theme.dark.palette.accent : undefined}>
          {msg.parts.map((part, idx) => {
            return <MessageFactory part={part} idx={idx} streaming={streaming} />
          })}
        </box>
      })}
    </box>
  );
};

// this just renders based on the matching Message type
function MessageFactory({
  part,
  idx,
  streaming = false,
}: {
  part: UIMessagePart<UIDataTypes, UITools>;
  idx: number;
  streaming: boolean;
}) {
  const { width } = useTerminalDimensions();
  const theme = useAtomValue(themeAtom);
  console.log(part)



  const getPartSpecifcComponent = () => {
    if (isToolUIPart(part)) {
      // Forcing function name incase title is missing
      let functionName = part.type.split("-")[1] || ""
      functionName = functionName.charAt(0).toUpperCase() + functionName.slice(1)
      return <SupportBlock
        title={part.title || functionName}
        content={
          typeof part.output == "string"
            ? part.output
            : JSON.stringify(part.output)
        }
        key={idx}
      />
    }
    switch (part.type) {
      case "reasoning":
        return (
          <SupportBlock
            title={part.type}
            content={part.text}
            key={idx}
          />
        );
      case "text":
        return (
          <Markdown
            key={idx}
            content={part.text}
            streaming={true}
            width={width}
          />
        );
      default:
        break;
    }

  }

  // const content = val.content as Array<TextPart | FilePart | ReasoningPart | ToolCallPart | ToolResultPart | ToolApprovalRequest>
  return (
    <box paddingX={1}>
      {
        getPartSpecifcComponent()
      }
    </box>
  );
}
