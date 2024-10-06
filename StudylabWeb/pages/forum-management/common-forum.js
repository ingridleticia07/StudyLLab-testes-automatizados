
const modalExcluirTopico = document.querySelector("#modal-excluir-topico");
const modalEditarTopico = document.querySelector("#modal-editar-topico");
const modalRespostaForum = document.querySelector("#modal-resposta-forum");

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

export function openDeleteModal(topicoId,page) {
openModal(modalExcluirTopico);

confirmDeleteButton.onclick = async function() {
    closeModal(modalExcluirTopico);
        try{
            await deleteTopicoDisciplina(topicoId);

            //getTopicosInfo(page,itemsPerPageValue);
        }catch(e){
            showModal(modalExcluirTopicoWarning);
        }
    };
}

export function copulateModalRespostaForum(data){
    let textAreaResposta = modalRespostaForum.querySelector("#editor-2 .editorAria");
    textAreaResposta.innerHTML = data.resposta;
}

export function copulateModalTopico(data){

    let idDisciplina = modalEditarTopico.querySelector("#select-disciplina");
    idDisciplina.value = data.disciplina.idDisciplina;
  
    let topico = modalEditarTopico.querySelector("#nome-topico");
    topico.value = data.nomeTopico;
  
    let idTopico = modalEditarTopico.querySelector("#id-topico");
    idTopico.value = data.idTopico;
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
          openModal(modalEditarTopico);
          copulateModalAndChangeTopico(forum);
      });
  
      const excluirForumBtn = document.createElement("button");
      excluirForumBtn.id = `disciplina-u-${forum.idTopico}`;
      excluirForumBtn.appendChild(excluirIcon());
      excluirForumBtn.classList.add("action-button");
      excluirForumBtn.classList.add("bloquear");
      
      excluirForumBtn.addEventListener('click',async function(e){
        openDeleteModal(forum.idForum, page);
      });
      
      actionColumn.appendChild(editarForumBtn);
      actionColumn.appendChild(excluirForumBtn);
    }
  
    row.appendChild(actionColumn);
    //Action buttons
    return row;
}