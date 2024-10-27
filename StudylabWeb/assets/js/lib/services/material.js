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

function getCookieByName(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
      return parts.pop().split(';').shift();
  }
  return null;
}

export async function saveMaterial(respostaMaterialDTO) {
    const formData = new FormData();
    const cookieName = '.csrf-token';
    const csrfToken = getCookieByName(cookieName);
    console.log(csrfToken)

    formData.append('Idtopico', respostaMaterialDTO.Idtopico);
    formData.append('TipoMaterial', respostaMaterialDTO.TipoMaterial);
    formData.append('IdUsuario', respostaMaterialDTO.IdUsuario);
    formData.append('file', respostaMaterialDTO.File);
    
    try {
        const response = await instance.post(
            MATERIAL_ENDPOINT + "/cadastrarDocumento",
            formData,
            {
                headers: { 
                    'X-CSRF-TOKEN': csrfToken, // CSRF token header
                    'Content-Type': 'multipart/form-data', // Important for sending FormData
                },
                withCredentials: true, // Ensures that cookies are sent
            }
        );

        if (response.status !== 200) {
            return null;
        }
        return response.data;
    } catch (error) {
        console.error('Error uploading material:', error);
        return null;
    }
}

// Helper function to get cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
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
  
  let response = await instance.delete(FORUM_ENDPOINT+"/deletarTopicoDiscussao?idTopicoDiscussao="+idTopico);

  if (response.status !== 200) {  
    return null;
  }
  return response.data;
}

export async function deleteDocumento(idDocumento) {
  
  let response = await instance.delete(MATERIAL_ENDPOINT+"/DeleteDocumento?idDocumento="+idDocumento);

  if (response.status !== 200) {
    return null;
  }
  return response.data;
}