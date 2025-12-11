import { instance } from "./axios.js";

const MATERIAL_ENDPOINT = "/material";

export async function getMaterialByDisciplinaOrTopico(page, pageSize, idDisciplina, idTopico) {
    let response = await instance.get(MATERIAL_ENDPOINT+
      "/ListarDocumentosWithPagination?page="+page+
      "&pageSize="+pageSize+"&idDisciplina="+idDisciplina+"&idTopico="+idTopico+"&isAnyStatus=true");
        
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
    const antifogeryToken = '.csrf-token';
    const antifogeryCookie = '.AspNetCore.Antiforgery.KeSRHT2WmJs';
    const csrfToken = getCookieByName(antifogeryToken);
    const cookieToken = getCookieByName(antifogeryCookie);

    const files = respostaMaterialDTO.File; // Assuming a file input element
    for (let i = 0; i < files.length; i++) {
        formData.append('file', files[i]); // The key 'file' must match the parameter name in your endpoint
    }

    formData.append('Idtopico', respostaMaterialDTO.Idtopico);
    formData.append('TipoMaterial', respostaMaterialDTO.TipoMaterial);
    formData.append('IdUsuario', respostaMaterialDTO.IdUsuario);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
  }
      try {
        const response = await instance.post(
            MATERIAL_ENDPOINT + "/cadastrarDocumento",
            formData,
            {
              headers: { 
                  'Content-Type': 'multipart/form-data', // Important for sending FormData,
                  'accept': 'application/json, text/plain, */*'
              }
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

export async function deleteDocumento(idDocumento,idUsuario) {
  
  let response = await instance.delete(MATERIAL_ENDPOINT+"/DeleteDocumento?idDocumento="+idDocumento+"&idUsuario="+idUsuario);

  if (response.status !== 200) {
    return null;
  }
  return response.data;
}