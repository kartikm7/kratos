import { toast } from "@opentui-ui/toast/react";
import { fetchAndCacheModels } from "../utils/models";
import { useSetAtom } from "jotai";
import { modelsListAtom } from "../state/atoms";

export const useRefreshModelsJson = () => {
  const setModelsList = useSetAtom(modelsListAtom);

  // this is just getting data for whatever models we currently have
  async function fetchAndSetModelsList(opts = { forceRefresh: false, successToast: false }) {
    const { forceRefresh, successToast } = opts
    const modelsList = await fetchAndCacheModels(forceRefresh);
    if (!modelsList) {
      toast.error("Model list is empty");
      return; // returning early
    } else {
      setModelsList(JSON.parse(JSON.parse(modelsList))); // this is so fucking weird
      successToast && toast.success("Fetched new model list!")
    }
  }

  return { fetchAndSetModelsList }
}
