import axios from "axios";

export async function getModels() {
  const response = await axios.get("https://models.dev/api.json")
  const data = response.data
}

