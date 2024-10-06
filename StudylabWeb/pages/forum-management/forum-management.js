import {getUserInfo} from "../../assets/js/lib/services/user.js";
import {getForumByDisciplinaOrTopico,createRespostaForum} from "../../assets/js/lib/services/forum.js";
import {copulateTopicoFilter, copulateDisciplinaFilter} from "./forum-repository.js";
import {closeModal,editIcon,excluirIcon,openModal,showModal,createForumRow} from "./common-forum.js";

const tableBody = document.querySelector("#disciplina-table tbody");
const btnResponderForum = document.querySelector("#cadastrar-forum-btn");
const btnSubmitTopico = document.querySelector("#button-submit");
const modalExcluirTopico = document.querySelector("#modal-excluir-topico");
const modalExcluirTopicoWarning = document.querySelector("#modal-excluir-warning");
const confirmDeleteButton = document.querySelector("#modal-excluir-topico .confirmar");
const modalResponderForum = document.querySelector("#modal-responder-forum");
const modalErroCadastrarTopico = document.querySelector("#modalErroAoCadastrarTopico");
const modalErroEditarTopico = document.querySelector("#modalErroAoEditarTopico");
const btnBuscarForumBtn = document.querySelector("#btn-buscar-forum");
const btnCadastrarResposta = document.querySelector("#button-submit");
const itemsPerPageValue = 5;
var actualPage = 1;
var usuario = null;

function openDeleteModal(topicoId,page) {
  openModal(modalExcluirTopico);
  
  confirmDeleteButton.onclick = async function() {
    closeModal(modalExcluirTopico);
    try{
      await deleteTopicoDisciplina(topicoId);

      getTopicosInfo(page,itemsPerPageValue);
    }catch(e){
      showModal(modalExcluirTopicoWarning);
    }
  };
}

window.onclick = function(event) {
  if (event.target.classList.contains('modal-container')) {
    closeModal(event.target);
  }
};

function copulateModalAndChangeTopico(data) {
  copulateModalTopico(data);

  let editarTopicoSubmitBtn = modalEditarTopico.querySelector("#button-submit");
  
  editarTopicoSubmitBtn.onclick = async function() {

    const formEditarTopico = modalEditarTopico.querySelector('form');
    let idTopico = formEditarTopico.querySelector('#id-topico').value;
    let nomeTopico = formEditarTopico.querySelector('#nome-topico').value;
    let idDisciplina = formEditarTopico.querySelector('#select-disciplina').value;

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const dateNow = `${year}-${month}-${day}`;
  
    const topicoDTO = {
      idTopico:idTopico,
      nomeTopico:nomeTopico,
      dataTopico:dateNow,
      disciplina:idDisciplina
    };

    try{
      await updateTopico(topicoDTO);
      getTopicosInfo(1,itemsPerPageValue);
      closeModal(modalEditarTopico);
    }catch(e){
     getTopicosInfo(1,itemsPerPageValue);
     showModal(modalErroEditarTopico);
    }
  };
}

const populateTable = (forums,page) => {
  
  tableBody.innerHTML = ""; // Clear existing rows
  forums.forEach((forum) => {
    const row = createForumRow(forum,page,usuario);
    tableBody.appendChild(row);
  });
};

async function getForumByDisciplinaAndTopico(page,pageSize,idDisciplina,idTopico) {
  try {

    usuario = await getUserInfo();
    
    const forums = await getForumByDisciplinaOrTopico(page, pageSize,idDisciplina,idTopico);
    
    const { pageCount: countInPage, maxPage } = forums;
    console.log(forums)
    populateTable(forums.respostasForum,page,idDisciplina,idTopico);
    addButtonsPagination(maxPage,itemsPerPageValue,idDisciplina,idTopico);
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
}

function addButtonsPagination(maxRegisterCounts,itemsPerPage,idDisciplina,idTopico){
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

btnResponderForum.addEventListener('click',async function(){
  let topicoSelected = document.querySelector("#topico-filter");
  if(topicoSelected.value !=0){
    let textTopico = topicoSelected.querySelector('option[value="'+topicoSelected.value+'"]').textContent;
    const selectText = document.querySelector("#editor-1 #topico-filter");
    selectText.innerHTML = '';
    const option = document.createElement("option");
    option.value = topicoSelected.value;
    option.textContent = textTopico;
    selectText.appendChild(option);
  }else{
    
  }

  openModal(modalResponderForum);
});

btnCadastrarResposta.addEventListener('click',async function(){

  const html = $("#editor-1").find('.editorAria').html();

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const dateNow = `${year}-${month}-${day}`;

  usuario = await getUserInfo();

  const respostaForumDTO = {
    resposta:html,
    dataResposta:dateNow,
    topicoDiscussao:8,
    usuario:usuario.id
  };
  alert(html.length)
  await createRespostaForum(respostaForumDTO);

});

document.querySelectorAll('.fechar').forEach(function(botao) {
  botao.addEventListener("click", function() {
    const modal = botao.closest('.modal-container');
    closeModal(modal);
  });
});

document.addEventListener("DOMContentLoaded", async() => {
  let preloaderDiv = document.getElementById("pre-loader");
  //await getForumByDisciplinaAndTopico(1,itemsPerPageValue,1,8);
  preloaderDiv.style.display = "none";
  copulateTopicoFilter();
  copulateDisciplinaFilter();
});

btnBuscarForumBtn.addEventListener('click',async()=>{
  let idDisciplina = document.getElementById("disciplina-filter").value;
  let idTopico = document.getElementById("topico-filter").value;

  await getForumByDisciplinaAndTopico(1,itemsPerPageValue,idDisciplina,idTopico)
});