import { fetchAndCacheModels } from "../utils/models";
import { useSetAtom } from "jotai";
import { modelsListAtom } from "../state/atoms";
import { useToast } from "./useToast";

export const useRefreshModelsJson = () => {
  const setModelsList = useSetAtom(modelsListAtom);
  const {toast} = useToast()

  // this is just getting data for whatever models we currently have
  async function fetchAndSetModelsList(opts = { forceRefresh: false, successToast: false }) {
    const { forceRefresh, successToast } = opts
    const modelsList = await fetchAndCacheModels(forceRefresh);
    if (!modelsList) {
      toast.error("Model list is empty");
      return; // returning early
    } else {
      let parsed = JSON.parse(modelsList);
      if (typeof parsed === "string") parsed = JSON.parse(parsed); // older caches were double encoded
      setModelsList(parsed);
      successToast && toast.success("Fetched new model list!")
    }
  }

  return { fetchAndSetModelsList }
}
