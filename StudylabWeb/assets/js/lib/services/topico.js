import { instance } from "./axios.js";

const DISCIPLINA_ENDPOINT = "/forum";

export async function getAllTopicosDisciplina(page, pageSize) {
    let response = await instance.get(DISCIPLINA_ENDPOINT+
      "/listarTopicosDiscussao?page="+page+"&pageSize="+pageSize+"");
  
    if (response.status !== 200) {
      return null;
    }
    return response.data;
}