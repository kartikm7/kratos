import { useDialog, type DialogActions } from "@opentui-ui/dialog/react";
import { Combobox } from "../../../ui/Combobox";
import { DialogHeader, DialogRoot } from "../../../ui/Dialog";
import {
  connectedProvidersAtom,
  llmAtom,
  modelsListAtom,
  selectedModelAtom,
} from "../../../state/atoms";
import { useAtomValue, useSetAtom } from "jotai";
import type { SelectOption } from "@opentui/core";
import { toast } from "@opentui-ui/toast/react";
import type { Model, ModelsList } from "../../../state/types";

// list based on connectedProviders
const SlashModelDialog = () => {
  const list = useAtomValue(modelsListAtom) as ModelsList;
  const setLlm = useSetAtom(llmAtom);
  const setSelectedModel = useSetAtom(selectedModelAtom);
  const connectedProviders = useAtomValue(connectedProvidersAtom);
  const dialog = useDialog();
  let availableModels = [] as Model[];

  // flatenning it to be {modelInfo + providerInfo}[]
  Object.entries(list ?? {}).forEach((entry) => {
    if (connectedProviders && connectedProviders[entry[0]]) {
      Object.entries(entry[1].models).forEach((modelEntry) => {
        const modelInfo = modelEntry[1];
        modelInfo.providerInfo = {
          id: entry[1].id,
          npm: entry[1].npm,
          name: entry[0],
        };
        availableModels.push(modelEntry[1]);
      });
    }
  });
  const options = availableModels.map((val) => {
    return {
      name: val.name,
      value: val,
      description: val.providerInfo?.name || "",
    };
  });

  const handleSubmit = async (comboxboxValue: SelectOption | undefined) => {
    try {
      if (!comboxboxValue) {
        toast.error("Model name is missing dawg");
        return; // early return
      }
      const selectedModel = comboxboxValue.value as Model;
      const pkg = await import(`${selectedModel.providerInfo?.npm}`);
      if (!pkg) {
        toast.error("Could not import model package");
        return;
      }
      const providerName = selectedModel.providerInfo?.name;
      if (!providerName) {
        toast.error("Provider name is missing");
        return;
      }
      const createModel =
        pkg[`create${providerName[0]?.toUpperCase() + providerName.slice(1)}`];
      if (!connectedProviders) {
        toast.error("Connected providers is empty");
        return;
      }
      const auth = connectedProviders[providerName];
      const model = createModel({ apiKey: auth?.key });
      console.log("inside slash", model);
      setLlm(() => model); // created Model object
      setSelectedModel(selectedModel);
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
