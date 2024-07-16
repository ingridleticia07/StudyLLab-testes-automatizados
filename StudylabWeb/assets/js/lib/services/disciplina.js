import { instance } from "./axios.js";

const DISCIPLINA_ENDPOINT = "/disciplina";

export async function getAllDisciplinas(page, pageSize) {
    let response = await instance.get(DISCIPLINA_ENDPOINT+"/listarDisciplinas");
  
    if (response.status !== 200) {
      return null;
    }
    return response.data;
}