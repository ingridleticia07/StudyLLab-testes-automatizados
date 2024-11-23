import {getUserInfo} from "../../assets/js/lib/services/user.js";
import {deleteDocumento,changeRespostaMaterial} from "../../assets/js/lib/services/material.js";
import {getMaterialByDisciplinaOrTopico,saveMaterial} from "../../assets/js/lib/services/material.js";

const modalEditarRespostaMaterial = document.querySelector("#modal-editar-resposta-forum");
const btnSaveChanges = modalEditarRespostaMaterial.querySelector("#button-submit");
const modalRespostaMaterial = document.querySelector("#modal-resposta-forum");
const modalExcluirResposta = document.querySelector("#modal-excluir-forum");
const confirmDeleteButton = document.querySelector("#modal-excluir-forum .confirmar");
const tableBody = document.querySelector("#disciplina-table tbody");
const modalResponderMaterial = document.querySelector("#modal-responder-forum");

var usuario = null;
var actualPage = 1;
const itemsPerPageValue = 5;

export function openModal(elemento) {
    elemento.style.display = "flex";
}

export function closeModal(elemento) {
    elemento.style.display = "none";
}

export function showModal(modalElement) {
    modalElement.style.animationName = "slideIn";
    modalElement.style.display = "flex"; 

    setTimeout(function() {
        modalElement.style.animationName = "slideOf"; 
        setTimeout(function() {
        modalElement.style.display = "none"; 
        }, 200); 
    }, 3000);
}

export function openDeleteModal(idDocumento,page,idDisciplina,idTopico) {
    openModal(modalExcluirResposta);
    
    confirmDeleteButton.onclick = async function() {
  
        closeModal(modalExcluirResposta);
    
        try{
            await deleteDocumento(idDocumento);
    
            getMaterialByDisciplinaAndTopico(actualPage,itemsPerPageValue,0,0);
        }catch(e){
            console.log(e)
        }
    };
};

export const viewIcon = () => {
    const editIcon = document.createElement("img");
    editIcon.src = "../../assets/img/eye.svg";
    editIcon.alt = "Editar";

    return editIcon;
};

export const editIcon = () => {
    const editIcon = document.createElement("img");
    editIcon.src = "../../assets/img/pencil.png";
    editIcon.alt = "Editar";

    return editIcon;
};

export const excluirIcon = () => {
    const excluirIcon = document.createElement("img");
    excluirIcon.src = "../../assets/img/icon-delete.svg";
    excluirIcon.alt = "Editar";

    return excluirIcon;
};

export async function createMaterial(materialDTO) {
    try {
      
      await saveMaterial(materialDTO);
      
      /*getMaterialByDisciplinaAndTopico(actualPage,itemsPerPageValue,0,0);
      closeModal(modalResponderMaterial);*/
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
}

export async function getMaterialByDisciplinaAndTopico(page,pageSize,idDisciplina,idTopico) {
    try {
  
      usuario = await getUserInfo();
      
      const material = await getMaterialByDisciplinaOrTopico(page, pageSize,idDisciplina,idTopico);

      const { pageCount: countInPage, maxPage } = material;
      console.log(material)
      populateTable(material.documentos,page,usuario);
      addButtonsPagination(maxPage,itemsPerPageValue,idDisciplina,idTopico);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
}

export const populateTable = (documentos,page,usuario,getMaterialByDisciplinaAndTopico) => {
  
    tableBody.innerHTML = ""; // Clear existing rows
    documentos.forEach((documento) => {
      const row = createMaterialRow(documento,page,usuario,getMaterialByDisciplinaAndTopico);
      tableBody.appendChild(row);
    });
};

export function addButtonsPagination(maxRegisterCounts,itemsPerPage,idDisciplina,idTopico){
    const paginationContainer = document.querySelector('body .pagination');
    
    paginationContainer.innerHTML = '';
  
    for (let i = 1; i <= maxRegisterCounts; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', function() {
            document.querySelectorAll('.pagination button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            getMaterialByDisciplinaAndTopico(i, itemsPerPage,idDisciplina,idTopico);
            actualPage = i;
        });
        paginationContainer.appendChild(button);
    }
  }

export function copulateModalRespostaMaterial(data){
    let textAreaResposta = modalRespostaMaterial.querySelector("#editor-2 .editorAria");
    textAreaResposta.innerHTML = `<img src="http://localhost:7125/${data.diretorioMaterial}" style="max-height:250px" alt="Description of the image" />`;
}

export function copulateModalAndChangeRespostaMaterial(data){

    let textAreaResposta = modalEditarRespostaMaterial.querySelector("#editor-3 .editorAria");
    textAreaResposta.innerHTML = data.resposta;

    btnSaveChanges.onclick = async function() {
        const html = $("#editor-3").find('.editorAria').html();

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateNow = `${year}-${month}-${day}`;

        usuario = await getUserInfo();

        const respostaMaterialDTO = {
            idResposta:data.idResposta,
            resposta:html,
            dataResposta:dateNow,
            topicoDiscussao:data.topicoDiscussao.idTopico,
            usuario:data.usuario.idUsuario
        };

        closeModal(modalEditarRespostaMaterial);
    
        try{
            await changeRespostaMaterial(respostaMaterialDTO);
    
            getMaterialByDisciplinaAndTopico(actualPage,itemsPerPageValue,0,0);
        }catch(e){
            showModal(modalExcluirTopicoWarning);
        }
    };
}

export function createMaterialRow(documento,page,usuario) {
    //User informations
    const row = document.createElement("tr");
    row.id = documento.idDocumento;
    const inputColumn = document.createElement("td");
    inputColumn.innerHTML = `<input type="checkbox" name="forum">`;
  
    const topicoColumn = document.createElement("td");
    topicoColumn.textContent = documento.topico.nomeTopico;
  
    const documentoColumn = document.createElement("td");
    documentoColumn.textContent = documento.diretorioMaterial;
    documentoColumn.style.display = 'none';

    const usuarioColum = document.createElement("td");
    usuarioColum.textContent = documento.usuario.nomeUsuario;

    const disciplinaColumn = document.createElement("td");
    disciplinaColumn.textContent = documento.topico.disciplina.nomeDisciplina;
    
    row.appendChild(inputColumn);
    row.appendChild(documentoColumn);
    row.appendChild(topicoColumn);
    row.appendChild(disciplinaColumn);
    row.appendChild(usuarioColum);
  
    const actionColumn = document.createElement("td");

    const visualizarMaterialBtn = document.createElement("button");
    visualizarMaterialBtn.id = `forum-${documento.idDocumento}`;
    visualizarMaterialBtn.appendChild(viewIcon());
    visualizarMaterialBtn.classList.add("action-button");
    visualizarMaterialBtn.classList.add("bloquear");
    visualizarMaterialBtn.addEventListener("click", function() {
        openModal(modalRespostaMaterial);
        copulateModalRespostaMaterial(documento);
    });

    actionColumn.appendChild(visualizarMaterialBtn);

    if(documento.usuario.idUsuario == usuario.id)
    {
      const editarMaterialBtn = document.createElement("button");
      editarMaterialBtn.id = `forum-${documento.idTopico}`;
      editarMaterialBtn.appendChild(editIcon());
      editarMaterialBtn.classList.add("action-button");
      editarMaterialBtn.classList.add("bloquear");
      
      editarMaterialBtn.addEventListener("click", function() {
          openModal(modalEditarRespostaMaterial);
          copulateModalAndChangeRespostaMaterial(forum);
      });
  
      const excluirMaterialBtn = document.createElement("button");
      excluirMaterialBtn.id = `disciplina-u-${documento.idTopico}`;
      excluirMaterialBtn.appendChild(excluirIcon());
      excluirMaterialBtn.classList.add("action-button");
      excluirMaterialBtn.classList.add("bloquear");
      
      excluirMaterialBtn.addEventListener('click',async function(e){
        openDeleteModal(documento.idDocumento, page, documento.topico.disciplina.idDisciplina,documento.topico.idTopico);
      });
      
      actionColumn.appendChild(editarMaterialBtn);
      actionColumn.appendChild(excluirMaterialBtn);
    }
  
    row.appendChild(actionColumn);
    //Action buttons
    return row;
}