import axios from "axios";
import { createOllama } from "ollama-ai-provider-v2";
import type { ModelsList } from "../state/types";

const OLLAMA_PROVIDER = "ollama";
const DEFAULT_OLLAMA_BASE_URL =
  process.env.KRATOS_OLLAMA_BASE_URL || "http://127.0.0.1:11434";

type OllamaTagsResponse = {
  models?: Array<{
    name: string;
    model?: string;
    details?: {
      family?: string;
      families?: string[];
      parameter_size?: string;
    };
  }>;
};

const normalizeOllamaBaseUrl = (baseUrl?: string) => {
  const value = (baseUrl || DEFAULT_OLLAMA_BASE_URL).trim();
  return value.endsWith("/") ? value.slice(0, -1) : value;
};

const testOllamaConnection = async (baseUrl?: string) => {
  await axios.get<OllamaTagsResponse>(
    `${normalizeOllamaBaseUrl(baseUrl)}/api/tags`,
  );
};

const fetchOllamaModels = async (baseUrl?: string) => {
  const response = await axios.get<OllamaTagsResponse>(
    `${normalizeOllamaBaseUrl(baseUrl)}/api/tags`,
  );
  return response.data.models ?? [];
};

const ollamaModelsList = async (baseUrl?: string): Promise<ModelsList> => {
  const models = await fetchOllamaModels(baseUrl);
  return {
    [OLLAMA_PROVIDER]: {
      models: Object.fromEntries(
        models.map((model) => {
          const modelId = model.model || model.name;
          const families = model.details?.families ?? [];
          const primaryFamily = model.details?.family || families[0] || "ollama";
          return [
            modelId,
            {
              id: modelId,
              name: model.name,
              family: primaryFamily,
              attachment: false,
              reasoning: false,
              tool_call: false,
              temperature: true,
              knowledge: "Local Ollama model",
              release_date: "",
              last_updated: "",
              modalities: {
                input: "text",
                output: "text",
              },
              open_weights: true,
              limit: {
                context: 4096,
                output: 2048,
              },
              status: "available",
              cost: {
                input: 0,
                output: 0,
              },
              providerInfo: {
                name: OLLAMA_PROVIDER,
              },
            },
          ];
        }),
      ),
    },
  };
};

const createOllamaProvider = (baseUrl?: string) =>
  createOllama({
    baseURL: `${normalizeOllamaBaseUrl(baseUrl)}/api`,
  });

export {
  OLLAMA_PROVIDER,
  DEFAULT_OLLAMA_BASE_URL,
  normalizeOllamaBaseUrl,
  testOllamaConnection,
  fetchOllamaModels,
  ollamaModelsList,
  createOllamaProvider,
};
