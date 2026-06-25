import { useDialog, type DialogActions } from "@opentui-ui/dialog/react";
import { useState } from "react";
import { saveProviderConfig } from "../../../utils/auth";
import { Combobox } from "../../../ui/Combobox";
import { DialogHeader, DialogRoot } from "../../../ui/Dialog";
import {
  connectedProvidersAtom,
  modelsListAtom,
} from "../../../state/atoms";
import { useAtomValue, useSetAtom } from "jotai";
import type { SelectOption } from "@opentui/core";
import { toast } from "@opentui-ui/toast/react";
import {
  DEFAULT_OLLAMA_BASE_URL,
  OLLAMA_PROVIDER,
  normalizeOllamaBaseUrl,
  ollamaModelsList,
  testOllamaConnection,
} from "../../../utils/ollama";

const SlashConnectDialog = () => {
  const [text, setText] = useState("");
  const [baseUrl, setBaseUrl] = useState(DEFAULT_OLLAMA_BASE_URL);
  const list = useAtomValue(modelsListAtom);
  const setConnectedProviders = useSetAtom(connectedProvidersAtom);
  const setModelsList = useSetAtom(modelsListAtom);
  const [comboboxValue, setComboboxValue] = useState<SelectOption | undefined>();
  const dialog = useDialog();

  const providerOptions = [
    {
      name: "ollama",
      value: "ollama",
      description: "local models via Ollama",
    },
    ...Object.entries(list ?? {})
      .filter(([providerName]) => providerName !== OLLAMA_PROVIDER)
      .map(([providerName]) => ({
        name: providerName,
        value: providerName,
        description: "",
      })),
  ];

  const handleSubmit = async () => {
    try {
      if (!comboboxValue) {
        toast.error("Provider name is missing dawg");
        return;
      }

      if (comboboxValue.name === OLLAMA_PROVIDER) {
        const normalizedBaseUrl = normalizeOllamaBaseUrl(baseUrl);
        await testOllamaConnection(normalizedBaseUrl);
        saveProviderConfig(OLLAMA_PROVIDER, {
          type: "local",
          provider: "ollama",
          baseUrl: normalizedBaseUrl,
        });
        setConnectedProviders((prev) => ({
          ...(prev ?? {}),
          [OLLAMA_PROVIDER]: {
            type: "local",
            provider: "ollama",
            baseUrl: normalizedBaseUrl,
          },
        }));
        const ollamaModels = await ollamaModelsList(normalizedBaseUrl);
        setModelsList((prev) => ({
          ...(prev ?? {}),
          ...ollamaModels,
        }));
        dialog.closeAll();
        toast.success("Ollama has connected big man!");
        return;
      }

      if (!text.trim()) {
        toast.error("API key is missing");
        return;
      }

      saveProviderConfig(comboboxValue.name, {
        type: "api",
        key: text,
      });
      setConnectedProviders((prev) => ({
        ...(prev ?? {}),
        [comboboxValue.name]: {
          type: "api",
          key: text,
        },
      }));
      dialog.closeAll();
      toast.success(`${comboboxValue.value} api key has been added!`);
    } catch (error) {
      toast.error(`Something went wrong ${error}`);
      console.log("Something went wrong", error);
    }
  };

  return (
    <DialogRoot>
      <DialogHeader>
        {!comboboxValue
          ? "Choose a model provider"
          : comboboxValue.name === OLLAMA_PROVIDER
            ? "Enter your Ollama base URL"
            : "Enter your API key"}
      </DialogHeader>
      {!comboboxValue ? (
        <Combobox
          setSubmitValue={setComboboxValue}
          placeholder="Model provider"
          options={providerOptions}
        />
      ) : comboboxValue.name === OLLAMA_PROVIDER ? (
        <>
          <input
            placeholder="Ollama base URL"
            onSubmit={handleSubmit}
            onInput={setBaseUrl}
            value={baseUrl}
            focused
          />
          <text>
            enter <span style={{ fg: "grey" }}>submit</span>
          </text>
        </>
      ) : (
        <>
          <input
            placeholder="API key"
            onSubmit={handleSubmit}
            onInput={setText}
            value={text}
            focused
          />
          <text>
            enter <span style={{ fg: "grey" }}>submit</span>
          </text>
        </>
      )}
    </DialogRoot>
  );
};

export const SlashConnect = (dialog: DialogActions) => {
  dialog.show({ content: () => <SlashConnectDialog /> });
};
