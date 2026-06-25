import { useDialog, type DialogActions } from "@opentui-ui/dialog/react";
import { useState } from "react";
import { saveProviderConfig } from "../../../utils/auth";
import { Combobox } from "../../../ui/Combobox";
import { DialogHeader, DialogRoot } from "../../../ui/Dialog";
import { connectedProvidersAtom, modelsListAtom } from "../../../state/atoms";
import { useAtomValue, useSetAtom } from "jotai";
import type { SelectOption } from "@opentui/core";
import { toast } from "@opentui-ui/toast/react";
import { LOCAL_PROVIDER } from "../../../utils/constants";
import type { ConnectedProvider } from "../../../state/types";

const SlashConnectDialog = () => {
  const [text, setText] = useState("");
  const list = useAtomValue(modelsListAtom);
  const setConnectedProviders = useSetAtom(connectedProvidersAtom);
  const [comboboxValue, setComboboxValue] = useState<
    SelectOption | undefined
  >();
  const dialog = useDialog();

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

  const handleSubmit = async () => {
    try {
      if (!comboboxValue) {
        toast.error("Provider name is missing dawg");
        return;
      }

      if (!text.trim()) {
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
          baseUrl: text,
        };
      } else {
        config = {
          type: "api",
          key: text,
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
          <input
            placeholder={
              comboboxValue.value === LOCAL_PROVIDER ? "base url" : "api key"
            }
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
