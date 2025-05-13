import {getUserInfo} from "../../assets/js/lib/services/user.js";
import {copulateTopicoFilter, copulateDisciplinaFilter,copulateTopicoFilterByDisciplina} from "./forum-repository.js";
import {closeModal,openModal,showModal,getForumByDisciplinaAndTopico, registerRespostaForum} from "./common-forum.js";

const btnResponderForum = document.querySelector("#cadastrar-forum-btn");
const btnSubmitTopico = document.querySelector("#button-submit");
const modalExcluirResposta = document.querySelector("#modal-excluir-resposta");
const modalExcluirTopicoWarning = document.querySelector("#modal-excluir-warning");
const confirmDeleteButton = document.querySelector("modal-excluir-resposta .confirmar");
const modalResponderForum = document.querySelector("#modal-responder-forum");
const modalErroCadastrarTopico = document.querySelector("#modalErroAoCadastrarTopico");
const modalErroEditarTopico = document.querySelector("#modalErroAoEditarTopico");
const btnBuscarForumBtn = document.querySelector("#btn-buscar-forum");
const btnCadastrarResposta = document.querySelector("#button-submit");
const itemsPerPageValue = 5;
var actualPage = 1;
var usuario = null;

//todo: retornar apenas dados sensíveis nas requisições get.

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

btnResponderForum.addEventListener('click',async function(){
  let topicoSelected = document.querySelector("#topico-filter");
  let disciplinaSelected = document.querySelector("#disciplina-filter");
  
  const selectText = document.querySelector("#topico-filter-modal");
  
  if(selectText!=null){
    selectText.innerHTML = '';
  }

  if(topicoSelected.value != 0){
    let textTopico = topicoSelected.querySelector('option[value="'+topicoSelected.value+'"]').textContent;
    const option = document.createElement("option");
    option.value = topicoSelected.value;
    option.textContent = textTopico;
    selectText.appendChild(option);
  }else{
    copulateTopicoFilterByDisciplina(disciplinaSelected.value);
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
  const topicoFilterModal = document.querySelector("#topico-filter-modal");

  usuario = await getUserInfo();

  const respostaForumDTO = {
    resposta:html,
    dataResposta:dateNow,
    topicoDiscussao:topicoFilterModal.value,
    usuario:usuario.id
  };
  
  registerRespostaForum(respostaForumDTO);

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