import { instance } from "./axios.js";

const FORUM_ENDPOINT = "/forum";

export async function getForumByDisciplinaOrTopico(page, pageSize, idDisciplina, idTopico) {
    let response = await instance.get(FORUM_ENDPOINT+
      "/listarRespostasForumByDisciplinaOrTopico?page="+page+
      "&pageSize="+pageSize+"&idDisciplina="+idDisciplina+"&idTopico="+idTopico+"");
        
    if (response.status !== 200) {
      return null;
    }
    return response.data;
}

export async function createRespostaForum(respostaForumDTO) {
  
  let response = await instance.post(FORUM_ENDPOINT+
    "/cadastrarRespostaForum",{
      resposta:respostaForumDTO.resposta,
      dataResposta:respostaForumDTO.dataResposta,
      topicoDiscussao:respostaForumDTO.topicoDiscussao,
      usuario:respostaForumDTO.usuario
    });
      
  if (response.status !== 200) {
    return null;
  }
  return response.data;
}

export async function changeRespostaForum(respostaForumDTO) {
  
  let response = await instance.put(FORUM_ENDPOINT+
    "/AtualizarRespostaForum",{
      idResposta:respostaForumDTO.idResposta,
      resposta:respostaForumDTO.resposta,
      dataResposta:respostaForumDTO.dataResposta,
      topicoDiscussao:respostaForumDTO.topicoDiscussao,
      usuario:respostaForumDTO.usuario
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

export async function deleteRespostaForum(idResposta, usuario) {
  
  let response = await instance.delete(FORUM_ENDPOINT+"/DeletarRespostaForum?idRespostaForum="+idResposta+"&idUsuario="+usuario.id);

  if (response.status !== 200) {
    return null;
  }
  return response.data;
}