import {getUserInfo} from "../../assets/js/lib/services/user.js";
import {deleteRespostaForum,changeRespostaForum} from "../../assets/js/lib/services/forum.js";
import {getForumByDisciplinaOrTopico,createRespostaForum} from "../../assets/js/lib/services/forum.js";

const modalEditarRespostaForum = document.querySelector("#modal-editar-resposta-forum");
const btnSaveChanges = modalEditarRespostaForum.querySelector("#button-submit");
const modalRespostaForum = document.querySelector("#modal-resposta-forum");
const modalExcluirResposta = document.querySelector("#modal-excluir-resposta");
const confirmDeleteButton = document.querySelector("#modal-excluir-resposta .confirmar");
const tableBody = document.querySelector("#disciplina-table tbody");
const modalResponderForum = document.querySelector("#modal-responder-forum");

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

export function openDeleteModal(idResposta,page,idDisciplina,idTopico) {
    openModal(modalExcluirResposta);
    
    confirmDeleteButton.onclick = async function() {
  
        closeModal(modalExcluirResposta);
    
        try{
            await deleteRespostaForum(idResposta);
    
            getForumByDisciplinaAndTopico(actualPage,itemsPerPageValue,0,0);
        }catch(e){
            showModal(modalExcluirTopicoWarning);
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

export async function registerRespostaForum(respostaForumDTO) {
    try {
      
      await createRespostaForum(respostaForumDTO);
      
      getForumByDisciplinaAndTopico(actualPage,itemsPerPageValue,0,0);
      closeModal(modalResponderForum);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
}

export async function getForumByDisciplinaAndTopico(page,pageSize,idDisciplina,idTopico) {
    try {
  
      usuario = await getUserInfo();
      
      const forums = await getForumByDisciplinaOrTopico(page, pageSize,idDisciplina,idTopico);

      const { pageCount: countInPage, maxPage } = forums;
      
      populateTable(forums.respostasForum,page,usuario);
      addButtonsPagination(maxPage,itemsPerPageValue,idDisciplina,idTopico);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
}

export const populateTable = (forums,page,usuario,getForumByDisciplinaAndTopico) => {
  
    tableBody.innerHTML = ""; // Clear existing rows
    forums.forEach((forum) => {
      const row = createForumRow(forum,page,usuario,getForumByDisciplinaAndTopico);
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
            getForumByDisciplinaAndTopico(i, itemsPerPage,idDisciplina,idTopico);
            actualPage = i;
        });
        paginationContainer.appendChild(button);
    }
  }

export function copulateModalRespostaForum(data){
    let textAreaResposta = modalRespostaForum.querySelector("#editor-2 .editorAria");
    textAreaResposta.innerHTML = data.resposta;
}

export function copulateModalAndChangeRespostaForum(data){

    let textAreaResposta = modalEditarRespostaForum.querySelector("#editor-3 .editorAria");
    textAreaResposta.innerHTML = data.resposta;

    btnSaveChanges.onclick = async function() {
        const html = $("#editor-3").find('.editorAria').html();

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateNow = `${year}-${month}-${day}`;

        usuario = await getUserInfo();

        const respostaForumDTO = {
            idResposta:data.idResposta,
            resposta:html,
            dataResposta:dateNow,
            topicoDiscussao:data.topicoDiscussao.idTopico,
            usuario:data.usuario.idUsuario
        };

        closeModal(modalEditarRespostaForum);
    
        try{
            await changeRespostaForum(respostaForumDTO);
    
            getForumByDisciplinaAndTopico(actualPage,itemsPerPageValue,0,0);
        }catch(e){
            showModal(modalExcluirTopicoWarning);
        }
    };
}

export function createForumRow(forum,page,usuario) {
    //User informations
    const row = document.createElement("tr");
    row.id = forum.idForum;
    const inputColumn = document.createElement("td");
    inputColumn.innerHTML = `<input type="checkbox" name="forum">`;
  
    const topicoColumn = document.createElement("td");
    topicoColumn.textContent = forum.topicoDiscussao.nomeTopico;
  
    const respostaForumColumn = document.createElement("td");
    respostaForumColumn.textContent = forum.resposta;
    respostaForumColumn.style.display = 'none';

    const usuarioColum = document.createElement("td");
    usuarioColum.textContent = forum.usuario.nomeUsuario;

    const disciplinaColumn = document.createElement("td");
    disciplinaColumn.textContent = forum.topicoDiscussao.disciplina.nomeDisciplina;
    
    row.appendChild(inputColumn);
    row.appendChild(topicoColumn);
    row.appendChild(respostaForumColumn);
    row.appendChild(disciplinaColumn);
    row.appendChild(usuarioColum);
  
    const actionColumn = document.createElement("td");

    const visualizarForumBtn = document.createElement("button");
    visualizarForumBtn.id = `forum-${forum.idTopico}`;
    visualizarForumBtn.appendChild(viewIcon());
    visualizarForumBtn.classList.add("action-button");
    visualizarForumBtn.classList.add("bloquear");
    visualizarForumBtn.addEventListener("click", function() {
        openModal(modalRespostaForum);
        copulateModalRespostaForum(forum);
    });

    actionColumn.appendChild(visualizarForumBtn);

    if(forum.usuario.idUsuario == usuario.id)
    {
      const editarForumBtn = document.createElement("button");
      editarForumBtn.id = `forum-${forum.idTopico}`;
      editarForumBtn.appendChild(editIcon());
      editarForumBtn.classList.add("action-button");
      editarForumBtn.classList.add("bloquear");
      
      editarForumBtn.addEventListener("click", function() {
          openModal(modalEditarRespostaForum);
          copulateModalAndChangeRespostaForum(forum);
      });
  
      const excluirForumBtn = document.createElement("button");
      excluirForumBtn.id = `disciplina-u-${forum.idTopico}`;
      excluirForumBtn.appendChild(excluirIcon());
      excluirForumBtn.classList.add("action-button");
      excluirForumBtn.classList.add("bloquear");
      
      excluirForumBtn.addEventListener('click',async function(e){
        openDeleteModal(forum.idResposta, page, forum.topicoDiscussao.disciplina.idDisciplina,forum.topicoDiscussao.idTopico);
      });
      
      actionColumn.appendChild(editarForumBtn);
      actionColumn.appendChild(excluirForumBtn);
    }
  
    row.appendChild(actionColumn);
    //Action buttons
    return row;
}