import { useDialog, type DialogActions } from "@opentui-ui/dialog/react";
import { useEffect, useRef, useState } from "react";
import { saveProviderConfig } from "../../../utils/auth";
import { Combobox } from "../../../ui/Combobox";
import { DialogHeader, DialogRoot } from "../../../ui/Dialog";
import { connectedProvidersAtom, modelsListAtom } from "../../../state/atoms";
import { useAtomValue, useSetAtom } from "jotai";
import type { InputRenderable, SelectOption } from "@opentui/core";
import { LOCAL_PROVIDER } from "../../../utils/constants";
import type { ConnectedProvider } from "../../../state/types";
import { useToast } from "../../../hooks/useToast";
import { useKeyboard } from "@opentui/react";

const SlashConnectDialog = () => {
  const apiKeyRef = useRef<InputRenderable>(null)
  const baseUrlRef = useRef<InputRenderable>(null)
  const list = useAtomValue(modelsListAtom);
  const setConnectedProviders = useSetAtom(connectedProvidersAtom);
  const [comboboxValue, setComboboxValue] = useState<
    SelectOption | undefined
  >();
  const dialog = useDialog();
  const { toast } = useToast();
  const isLocalProvider = comboboxValue?.value === LOCAL_PROVIDER

  useEffect(() => {
    if (isLocalProvider) baseUrlRef.current?.focus()
  }, [isLocalProvider, baseUrlRef.current])

  useKeyboard(key => {
    if (key.name == "tab") {
      if (!baseUrlRef.current?.focused) baseUrlRef.current?.focus()
      else apiKeyRef.current?.focus()
    }
  })

  const updatePersistedState = (
    provider: string,
    config: ConnectedProvider,
  ) => {
    saveProviderConfig(provider, config);
    setConnectedProviders((prev) => ({
      ...(prev ?? {}),
      [provider]: config,
    }));
  };

  const providerOptions = [
    {
      name: `${LOCAL_PROVIDER} (llamacpp, ollama, lm studio, etc)`,
      value: LOCAL_PROVIDER,
      description:
        "Use your llamacpp, ollama, lm studio open ai compatible endpoints",
    },
    ...Object.entries(list ?? {}).map(([providerName]) => ({
      name: providerName,
      value: providerName,
      description: "",
    })),
  ];

  const handleSubmit = () => {
    try {
      const baseUrl = baseUrlRef?.current?.value || ""
      const apiKey = apiKeyRef?.current?.value || ""
      if (!comboboxValue) {
        toast.error("Provider name is missing dawg");
        return;
      }

      if (comboboxValue.value !== LOCAL_PROVIDER && !apiKey.trim()) {
        toast.error("API key is missing");
        return;
      }

      const isLocalProvider = comboboxValue.value === LOCAL_PROVIDER;
      const provider = comboboxValue.value;
      let config: ConnectedProvider;

      // I wish this didn't need to be written like this for the lsp to understand
      if (isLocalProvider) {
        config = {
          type: LOCAL_PROVIDER,
          provider: LOCAL_PROVIDER,
          baseUrl: baseUrl,
          key: apiKey
        };
      } else {
        config = {
          type: "api",
          key: apiKey,
        };
      }

      updatePersistedState(provider, config);

      const message = isLocalProvider
        ? "Welcome to the PC master race big man!"
        : `${comboboxValue.value} api key has been added!`;
      toast.success(message);
      dialog.closeAll();
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
          : comboboxValue.value === LOCAL_PROVIDER
            ? "Enter your local provider base URL"
            : "Enter your API key"}
      </DialogHeader>
      {!comboboxValue ? (
        <Combobox
          setSubmitValue={setComboboxValue}
          placeholder="Model provider"
          options={providerOptions}
        />
      ) : (
        <>
          {comboboxValue.value === LOCAL_PROVIDER && <input
            ref={baseUrlRef}
            placeholder="base url"
            onSubmit={handleSubmit}
          />
          }
          <input
            ref={apiKeyRef}
            placeholder={
              comboboxValue.value === LOCAL_PROVIDER ? "api key (optional)" : "api key"
            }
            onSubmit={handleSubmit}
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
