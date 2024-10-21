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

export async function saveMaterial(respostaMaterialDTO) {
    const formData = new FormData();
    
    // Retrieve the CSRF token from the cookie
    const csrfToken = "CfDJ8LZy-n5US5VCgrht1Q-uZ7e7chzu-p5_uQ3NQv21uhj-n0rCFJgM1vNJitVCn4DlMRpx9s84vwsU8K5WJ-Az3JNfu8IYWQFe_dXjwH5Mo4CwsZLnSS5Tk_Sl2G1osTRLQGofbWbUHPFHXQyhvEcoyKU";
    // Append your form data fields
    formData.append('Idtopico', respostaMaterialDTO.Idtopico);
    formData.append('TipoMaterial', respostaMaterialDTO.TipoMaterial);
    formData.append('IdUsuario', respostaMaterialDTO.IdUsuario);
    formData.append('file', respostaMaterialDTO.File);
    
    const cookieValue = "CfDJ8LZy-n5US5VCgrht1Q-uZ7dCnSwBWE9B7Y2UtZj5KfGMj4cdWwtqEK0llZ4Egn5ACBwbuSFhVmj54sKVJ0rMU9vONFURE4x8SZAFayQ6fsnusAj7xTzQUrxBRgm2A5D64YRu7ptrzMCqwEwHOubcINo";

    document.cookie = `.AspNetCore.Antiforgery.KeSRHT2WmJs=${cookieValue}; path=/; secure; samesite=Strict`;
    
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