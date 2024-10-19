import { instance } from "./axios.js";

const MATERIAL_ENDPOINT = "/material";

export async function getMaterialByDisciplinaOrTopico(page, pageSize, idDisciplina, idTopico) {
    let response = await instance.get(MATERIAL_ENDPOINT+
      "/ListarDocumentosWithPagination?page="+page+
      "&pageSize="+pageSize+"&idDisciplina="+idDisciplina+"&idTopico="+idTopico+"");
        
    if (response.status !== 200) {
      return null;
    }
    return response.data;
}

export async function createRespostaMaterial(respostaMaterialDTO) {
  
  let response = await instance.post(MATERIAL_ENDPOINT+
    "/cadastrarRespostaMaterial",{
      resposta:respostaMaterialDTO.resposta,
      dataResposta:respostaMaterialDTO.dataResposta,
      topicoDiscussao:respostaMaterialDTO.topicoDiscussao,
      usuario:respostaMaterialDTO.usuario
    });
      
  if (response.status !== 200) {
    return null;
  }
  return response.data;
}

export async function changeRespostaMaterial(respostaMaterialDTO) {
  
  let response = await instance.put(FORUM_ENDPOINT+
    "/AtualizarRespostaMaterial",{
      idResposta:respostaMaterialDTO.idResposta,
      resposta:respostaMaterialDTO.resposta,
      dataResposta:respostaMaterialDTO.dataResposta,
      topicoDiscussao:respostaMaterialDTO.topicoDiscussao,
      usuario:respostaMaterialDTO.usuario
    });
      
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
  let response = await instance.put(FORUM_ENDPOINT+"/editarTopicoDiscussao",{
    idTopico:topico.idTopico,
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

export async function deleteRespostaMaterial(idResposta) {
  
  let response = await instance.delete(FORUM_ENDPOINT+"/DeletarRespostaMaterial?idRespostaMaterial="+idResposta);

  if (response.status !== 200) {
    return null;
  }
  return response.data;
}