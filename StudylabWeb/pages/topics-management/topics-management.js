import { getAllTopicosDisciplina,createTopico,updateTopico,deleteTopicoDisciplina} from "../../assets/js/lib/services/topico.js";
import { getAllDisciplinas} from "../../assets/js/lib/services/disciplina.js";

const tableBody = document.querySelector("#disciplina-table tbody");
const btnCadastrarTopico = document.querySelector("#cadastrar-btn");
const btnSubmitTopico = document.querySelector("#button-submit");
const modalExcluirTopico = document.querySelector("#modal-excluir-topico");
const confirmDeleteButton = document.querySelector("#modal-excluir-topico .confirmar");
const modalCadastrarTopico = document.querySelector("#modal-cadastrar-topico");
const modalEditarTopico = document.querySelector("#modal-editar-topico");
const disciplinaOptions = modalCadastrarTopico.querySelector("#select-disciplina");
const disciplinaOptionsToChange = modalEditarTopico.querySelector("#select-disciplina");
const modalErroCadastrarTopico = document.querySelector("#modalErroAoCadastrarTopico");
const modalErroEditarTopico = document.querySelector("#modalErroAoEditarTopico");
const itemsPerPageValue = 5;
var actualPage = 1;

async function copulateTopicosDisciplina(){
  try {
    const disciplinasCount = await getAllDisciplinas(1, 1);

    const disciplinas = await getAllDisciplinas(1, disciplinasCount.maxPage);
    addTopico(disciplinas.disciplinas);

  } catch (error) {
    console.error("Error fetching user info:", error);
  }
}

function openDeleteModal(topicoId,page) {
  openModal(modalExcluirTopico);
  
  confirmDeleteButton.onclick = async function() {
    closeModal(modalExcluirTopico);
    try{
      await deleteTopicoDisciplina(topicoId);

      getTopicosInfo(page,itemsPerPageValue);
    }catch(e){
      console.log(e);
    }
  };
}

function addTopico(disciplinas){
  disciplinas.forEach(optionData => {
    const option = document.createElement('option');
    option.value = optionData.idDisciplina;
    option.text = optionData.nomeDisciplina;
    disciplinaOptions.appendChild(option);

    const optionToChange = document.createElement('option');
    optionToChange.value = optionData.idDisciplina;
    optionToChange.text = optionData.nomeDisciplina;
    disciplinaOptionsToChange.appendChild(optionToChange);
  });
}

window.onclick = function(event) {
  if (event.target.classList.contains('modal-container')) {
    closeModal(event.target);
  }
};

function openModal(elemento) {
  elemento.style.display = "flex";
}

function closeModal(elemento) {
  elemento.style.display = "none";
}

function showModal(modalElement) {
  modalElement.style.animationName = "slideIn";
  modalElement.style.display = "block"; 

  setTimeout(function() {
    modalElement.style.animationName = "slideOf"; 
    setTimeout(function() {
      modalElement.style.display = "none"; 
    }, 200); 
  }, 5000);
}

const editIcon = () => {
  const editIcon = document.createElement("img");
  editIcon.src = "../../assets/img/pencil.png";
  editIcon.alt = "Editar";

  return editIcon;
};

const excluirIcon = () => {
  const excluirIcon = document.createElement("img");
  excluirIcon.src = "../../assets/img/icon-delete.svg";
  excluirIcon.alt = "Editar";

  return excluirIcon;
};

function copulateModalTopico(data){

  let idDisciplina = modalEditarTopico.querySelector("#select-disciplina");
  idDisciplina.value = data.disciplina.idDisciplina;

  let topico = modalEditarTopico.querySelector("#nome-topico");
  topico.value = data.nomeTopico;

  let idTopico = modalEditarTopico.querySelector("#id-topico");
  idTopico.value = data.idTopico;
}


function copulateModalAndChangeTopico(data,page) {
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

function createTopicoRow(topicoDisciplina,page) {
  //User informations
  const row = document.createElement("tr");
  row.id = topicoDisciplina.idTopico;
  const inputColumn = document.createElement("td");
  inputColumn.innerHTML = `<input type="checkbox" name="disciplina">`;

  const topicoDisciplinaColumn = document.createElement("td");
  topicoDisciplinaColumn.textContent = topicoDisciplina.nomeTopico;

  const disciplinaColumn = document.createElement("td");
  disciplinaColumn.textContent = topicoDisciplina.disciplina.nomeDisciplina;
  
  row.appendChild(inputColumn);
  row.appendChild(topicoDisciplinaColumn);
  row.appendChild(disciplinaColumn);

  const actionColumn = document.createElement("td");
  
  const editarTopicoBtn = document.createElement("button");
  editarTopicoBtn.id = `disciplina-u-${topicoDisciplina.idTopico}`;
  editarTopicoBtn.appendChild(editIcon());
  editarTopicoBtn.classList.add("action-button");
  editarTopicoBtn.classList.add("bloquear");
  
  editarTopicoBtn.addEventListener("click", function() {
      openModal(modalEditarTopico);
      copulateModalAndChangeTopico(topicoDisciplina,page);
  });
  
  const excluirTopicoBtn = document.createElement("button");
  excluirTopicoBtn.id = `disciplina-u-${topicoDisciplina.disciplina.idDisciplina}`;
  excluirTopicoBtn.appendChild(excluirIcon());
  excluirTopicoBtn.classList.add("action-button");
  excluirTopicoBtn.classList.add("bloquear");
  
  excluirTopicoBtn.addEventListener('click',async function(e){
    openDeleteModal(topicoDisciplina.idTopico, page);
  });

  actionColumn.appendChild(editarTopicoBtn);
  actionColumn.appendChild(excluirTopicoBtn);
  row.appendChild(actionColumn);
  //Action buttons
  return row;
}


const populateTable = (topicos,page) => {
  tableBody.innerHTML = ""; // Clear existing rows
  topicos.forEach((topico) => {
    const row = createTopicoRow(topico,page);
    tableBody.appendChild(row);
  });
};

async function getTopicosInfo(page,pageSize) {
  try {
    const topicos = await getAllTopicosDisciplina(page, pageSize);
    const { pageCount: countInPage, maxPage } = topicos;
    
    populateTable(topicos.topicos,page);
    addButtonsPagination(maxPage,itemsPerPageValue);
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
}

function addButtonsPagination(maxRegisterCounts,itemsPerPage){
  const paginationContainer = document.querySelector('body .pagination');

  paginationContainer.innerHTML = ''; // Clear previous buttons

  for (let i = 1; i <= maxRegisterCounts; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.addEventListener('click', function() {
          document.querySelectorAll('.pagination button').forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          getTopicosInfo(i, itemsPerPage);
          actualPage = i;
      });
      paginationContainer.appendChild(button);
  }
}

btnCadastrarTopico.addEventListener('click',function(){
  openModal(modalCadastrarTopico);
});

btnSubmitTopico.addEventListener('click',async function(e){
  const formCadastrarDisciplina = modalCadastrarTopico.querySelector('form');
  let nomeTopico = formCadastrarDisciplina.querySelector('#nomeTopico').value;
  let disciplina = formCadastrarDisciplina.querySelector('#select-disciplina').value;
  
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const dateNow = `${year}-${month}-${day}`;

  const topicoDTO = {
    nomeTopico:nomeTopico,
    dataTopico:dateNow,
    disciplina:disciplina
  };

   try{
     await createTopico(topicoDTO);
     getTopicosInfo(1,itemsPerPageValue);
     closeModal(modalCadastrarTopico);
   }catch(e){
    getTopicosInfo(1,itemsPerPageValue);
    showModal(modalErroCadastrarTopico);
   }
});



document.querySelectorAll('.fechar').forEach(function(botao) {
  botao.addEventListener("click", function() {
    const modal = botao.closest('.modal-container');
    closeModal(modal);
  });
});

document.addEventListener("DOMContentLoaded", async() => {
  let preloaderDiv = document.getElementById("pre-loader");
  await getTopicosInfo(1,itemsPerPageValue);
  preloaderDiv.style.display = "none";
  copulateTopicosDisciplina();
});
