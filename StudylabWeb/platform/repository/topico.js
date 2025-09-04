import { instance } from "./axios.js";

const FORUM_ENDPOINT = "/forum";

export async function getAllTopicosDisciplinaWithPagination(page, pageSize, idDisciplina = 0) {
    let response = await instance.get(FORUM_ENDPOINT+
      "/listarTopicosDiscussaoWithPagination?page="+page+"&pageSize="+pageSize+"&idDisciplina="+idDisciplina+"");
  
    if (response.status !== 200) {
      return null;
    }
    return response.data;
}

export async function getAllTopicosDisciplina() {
  let response = await instance.get(FORUM_ENDPOINT+
    "/listarTopicosDiscussao");

  if (response.status !== 200) {
    return null;
  }
  return response.data;
}

export async function getAllTopicosDisciplinaByDisciplina(idDisciplina) {
  let response = await instance.get(FORUM_ENDPOINT+
    "/listarTopicosDiscussaoByDisciplina?idDisciplina="+idDisciplina);

  if (response.status !== 200) {
    return null;
  }
  return response.data;
}

export async function createTopico(topico) {
  let response = await instance.post(FORUM_ENDPOINT+"/criarTopicoDiscussao",{
    nomeTopico:topico.nomeTopico,
    dataTopico:topico.dataTopico,
    disciplina:topico.disciplina,
    idUsuario: topico.idUsuario
  });

  if (response.status !== 200) {
    return null;
  }
  return response.data;
}

export async function updateTopico(topico) {
  console.log(topico)
  let response = await instance.put(FORUM_ENDPOINT+"/editarTopicoDiscussao",{
    idTopico:topico.idTopico,
    idUsuario:topico.idUsuario,
    nomeTopico:topico.nomeTopico,
    dataTopico:topico.dataTopico,
    disciplina:topico.disciplina
  });

  if (response.status !== 200) {
    return null;
  }
  return response.data;
}

export async function deleteTopicoDisciplina(idTopico) {
  console.log(idTopico)
  let response = await instance.delete(FORUM_ENDPOINT+"/deletarTopicoDiscussao?idTopicoDiscussao="+idTopico);

  if (response.status !== 200) {
    return null;
  }
  return response.data;
}