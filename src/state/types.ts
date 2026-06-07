import type {
  FilePart,
  ReasoningUIPart,
  TextPart,
  ToolCallPart,
  ToolResultPart,
} from "ai";

type Model = {
  id: string;
  name: string;
  family: string;
  attachment: boolean;
  reasoning: boolean;
  tool_call: boolean;
  temperature: boolean;
  knowledge: string;
  release_date: string;
  last_updated: string;
  modalities: {
    input: "text" | "image"[];
    output: "text" | "image"[];
  };
  open_weights: boolean;
  limit: {
    context: number;
    output: number;
  };
  status: string;
  cost: {
    input: number;
    output: number;
  };
  // this I have added optional because, I need to flatten the map as I don't want to write a new a custom select component
  // the current one is just a little jagged, since we don't have access to <option> tag
  providerInfo?: {
    id?: string;
    npm?: string;
    name: string;
  };
};
type ProviderDetails = {
  id?: string;
  env?: string[];
  npm?: string;
  doc?: string;
  models: { [key: string]: Model };
};

type ModelsList = {
  [key: string]: ProviderDetails;
};

type ConnectedProvidersList = {
  [key: string]: {
    key: string;
    type: "api";
  };
};

type AiMessage =
  | TextPart
  | FilePart
  | ReasoningUIPart
  | ToolCallPart
  | ToolResultPart;
type MessageStream = Array<AiMessage>;

export {
  type Model,
  type ProviderDetails,
  type ModelsList,
  type ConnectedProvidersList,
  type AiMessage,
  type MessageStream,
};
