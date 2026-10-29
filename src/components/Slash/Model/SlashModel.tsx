import { useDialog, type DialogActions } from "@opentui-ui/dialog/react";
import { Combobox } from "../../../ui/Combobox";
import { DialogHeader, DialogRoot } from "../../../ui/Dialog";
import {
  connectedProvidersAtom,
  llmAtom,
  modelsListAtom,
  selectedModelAtom,
} from "../../../state/atoms";
import { saveSelectedModel } from "../../../utils/preferences";
import { useAtomValue, useSetAtom } from "jotai";
import type { SelectOption } from "@opentui/core";
import type { Model, ModelsList } from "../../../state/types";
import { createModel, getLocalModels } from "../../../utils/models";
import { useToast } from "../../../hooks/useToast";
import { useEffect, useState } from "react";
import { LOCAL_PROVIDER } from "../../../utils/constants";

// list based on connectedProviders
const SlashModelDialog = () => {
  const list = useAtomValue(modelsListAtom) as ModelsList;
  const setLlm = useSetAtom(llmAtom);
  const setSelectedModel = useSetAtom(selectedModelAtom);
  const connectedProviders = useAtomValue(connectedProvidersAtom);
  const { toast } = useToast();
  const dialog = useDialog();
  const availableModels = [] as Model[];
  // flatenning it to be {modelInfo + providerInfo}[]
  Object.entries(list ?? {}).forEach((entry) => {
    if (connectedProviders && connectedProviders[entry[0]]) {
      Object.entries(entry[1].models).forEach((modelEntry) => {
        const modelInfo = modelEntry[1];
        modelInfo.providerInfo = {
          id: entry[1].id,
          npm: entry[1].npm,
          name: entry[0],
          api: entry[1].api,
        };
        availableModels.push(modelEntry[1]);
      });
    }
  });

  const [options, setOptions] = useState<SelectOption[]>(
    availableModels.map((val) => {
      return {
        name: val.name,
        value: val,
        description: val.providerInfo?.name || "",
      };
    }),
  );

  useEffect(() => {
    addLocalModelsToOptions();
    async function addLocalModelsToOptions() {
      if (!connectedProviders?.[LOCAL_PROVIDER]) return; // no local provider connected
      let localModels: Model[];
      try {
        localModels = await getLocalModels(connectedProviders);
      } catch (error) {
        toast.error(`Could not reach local provider: ${error}`);
        return;
      }
      const localModelOptions = localModels.map((val) => {
        return {
          name: val.name,
          value: val,
          description: "custom provider likely llama.cpp/ollama/lm-studio",
        };
      });
      setOptions((pre) => [...localModelOptions, ...pre]);
    }
  }, []);

  const handleSubmit = async (comboxboxValue: SelectOption | undefined) => {
    try {
      if (!comboxboxValue) {
        toast.error("Model name is missing dawg");
        return; // early return
      }
      const selectedModel = comboxboxValue.value as Model;
      const model = createModel(selectedModel, connectedProviders || {});
      console.log("inside slash", model);
      setLlm(() => model); // created Model object
      setSelectedModel(selectedModel);
      saveSelectedModel(selectedModel);
      toast.success(`Set ${selectedModel.name} as the default model!`);
      dialog.closeAll();
    } catch (error) {
      toast.error(`Something went wrong ${error}`);
      console.log("Something went wrong", error);
    }
  };

  return (
    <DialogRoot>
      <DialogHeader>Choose a model</DialogHeader>
      <Combobox
        onSubmit={handleSubmit}
        showDescription
        placeholder="Model name"
        options={options}
      />
    </DialogRoot>
  );
};

export const SlashModel = (dialog: DialogActions) => {
  dialog.show({ content: () => <SlashModelDialog /> });
};
