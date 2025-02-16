import { getAllDisciplinasWithPagination,createDisciplina,editarDisciplina,deleteDisciplina } from "../../assets/js/lib/services/disciplina.js";

const modalExc = document.getElementById("modal-excluir");
const modalBan = document.getElementById("modal-banir");
const deleteButtons = document.querySelectorAll(".deletar");
const banButtons = document.querySelectorAll(".banir");
const cadastrarDisciplinaBtn = document.querySelector("#cadastrar-btn");
const cadastrarDisciplinaBtnSubmit = document.querySelector("#button-submit");
const modalCadastrarDisciplina = document.querySelector("#modal-cadastrar-disciplina");
const modalEditarDisciplina = document.querySelector("#modal-editar-disciplina");
const modalExcluirDisciplina = document.querySelector("#modal-excluir-disciplina");
const confirmDeleteButton = document.querySelector("#modal-excluir-disciplina .confirmar");
const modalSuccess = document.querySelector("#modalSuccess");
const modalWarning = document.querySelector("#modalWarning");
var modal = document.getElementById("modalConfirmacao");
const tableBody = document.querySelector("#disciplina-table tbody");
const itemsPerPageValue = 5;

function openModal(elemento) {
  elemento.style.display = "flex";
}

function copulateModalDisciplina(data){

  let IdDisciplina = modalEditarDisciplina.querySelector("#id-disciplina");
  IdDisciplina.value = data.idDisciplina;

  let disciplina = modalEditarDisciplina.querySelector("#disciplina");
  disciplina.value = data.nomeDisciplina;

  let professor = modalEditarDisciplina.querySelector("#nome-professor");
  professor.value = data.professorDisciplina;

  let curso = modalEditarDisciplina.querySelector("#curso");
  curso.value = data.curso.idCurso;

  let numeroAlunos = modalEditarDisciplina.querySelector("#numero-alunos");
  numeroAlunos.value = data.quantidadeAluno;

  let codigoDisciplina = modalEditarDisciplina.querySelector("#codigo-disciplina");
  codigoDisciplina.value = data.codigoDisciplina;

  let IdProfessor = modalEditarDisciplina.querySelector("#id-professor");
  IdProfessor.value = data.professor.idUsuario
}

function copulateModalAndChangeDisciplina(data,page) {
  
  copulateModalDisciplina(data);

  let editarDisciplinaSubmitBtn = modalEditarDisciplina.querySelector("#button-submit");
  
  editarDisciplinaSubmitBtn.onclick = async function() {
    
    let IdDisciplina = modalEditarDisciplina.querySelector("#id-disciplina").value;

    let IdProfessor = modalEditarDisciplina.querySelector("#id-professor").value;

    let disciplina = modalEditarDisciplina.querySelector("#disciplina").value;

    let professor = modalEditarDisciplina.querySelector("#nome-professor").value;

    let curso = modalEditarDisciplina.querySelector("#curso").value;

    let numeroAlunos = modalEditarDisciplina.querySelector("#numero-alunos").value;

    let codigoDisciplina = modalEditarDisciplina.querySelector("#codigo-disciplina").value;

    var data = {
      idDisciplina:IdDisciplina,
      nomeDisciplina:disciplina,
      professorDisciplina:professor,
      fkProfesor:IdProfessor,
      curso:curso,
      quantidadeAluno:numeroAlunos,
      codigoDisciplina:codigoDisciplina
    };

    try{

      closeModal(modalEditarDisciplina);

      await editarDisciplina(data);

      getDisciplinasInfo(page,itemsPerPageValue);
      //showModal(document.getElementById("modalConfirmacaoBloqueioUsuario"));
    }catch(e){
      
      //showModal(document.getElementById("modalErroAoBloquearUsuario"));
    }

  };
}


function openDeleteModal(page,disciplinaId) {
  openModal(modalExcluirDisciplina);
  
  confirmDeleteButton.onclick = async function() {
    closeModal(modalExcluirDisciplina);
    try{
      await deleteDisciplina(disciplinaId);

      getDisciplinasInfo(page,itemsPerPageValue);
    }catch(e){
      showModal(document.getElementById("modalErroAoExcluir"));
    }
  };
}

  let editarDisciplinaSubmitBtn = modalEditarDisciplina.querySelector("#button-submit");
function closeModal(elemento) {
  elemento.style.display = "none";
}

deleteButtons.forEach(function(botao) {
    botao.addEventListener("click", function() {
        console.log("Botão deletar clicado!");
        openModal(modalExc);
    });
});

banButtons.forEach(function(botao) {
  botao.addEventListener("click", function() {
      console.log("Botão de banir clicado!");
      openModal(modalBan);
  });
});


document.querySelectorAll('.fechar').forEach(function(botao) {
  botao.addEventListener("click", function() {
    const modal = botao.closest('.modal-container');
    closeModal(modal);
  });
});

document.querySelectorAll('.cancelar').forEach(function(botao) {
  botao.addEventListener("click", function() {
    const modal = botao.closest('.modal-container');
    closeModal(modal);
  });
});

document.querySelectorAll('.confirmar').forEach(function(botao) {
  botao.addEventListener("click", function() {
    const modal = botao.closest('.modal-container');
    closeModal(modal);
    showModal(modal);
  });
});


window.onclick = function(event) {
  if (event.target.classList.contains('modal-container')) {
    closeModal(event.target);
  }
};

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

function createDisciplinaRow(disciplina,page) {
  
  //User informations
  const row = document.createElement("tr");
  row.id = disciplina.idDisciplina;
  const inputColumn = document.createElement("td");
  inputColumn.innerHTML = `<input type="checkbox" name="disciplina">`;

  const codigoColumn = document.createElement("td");
  codigoColumn.textContent = disciplina.codigoDisciplina;

  const disciplinaColumn = document.createElement("td");
  disciplinaColumn.textContent = disciplina.nomeDisciplina;

  const professorColumn = document.createElement("td");
  professorColumn.textContent = disciplina.professorDisciplina;

  const cursoColumn = document.createElement("td");
  cursoColumn.textContent = disciplina.curso.nomeCurso;

  const quantidadeAlunos = document.createElement("td");
  quantidadeAlunos.textContent = disciplina.quantidadeAluno;
  
  row.appendChild(inputColumn);
  row.appendChild(codigoColumn);
  row.appendChild(disciplinaColumn);
  row.appendChild(professorColumn);
  row.appendChild(cursoColumn);
  row.appendChild(quantidadeAlunos);

  const actionColumn = document.createElement("td");
  
  const editarDisciplinaBtn = document.createElement("button");
  editarDisciplinaBtn.id = `disciplina-u-${disciplina.idDisciplina}`;
  editarDisciplinaBtn.appendChild(editIcon());
  editarDisciplinaBtn.classList.add("action-button");
  editarDisciplinaBtn.classList.add("bloquear");
  
  editarDisciplinaBtn.addEventListener("click", () => {
    openModal(modalEditarDisciplina);
    copulateModalAndChangeDisciplina(disciplina,page);
  });

  const excluirDisciplinaBtn = document.createElement("button");
  excluirDisciplinaBtn.id = `disciplina-u-${disciplina.idDisciplina}`;
  excluirDisciplinaBtn.appendChild(excluirIcon());
  excluirDisciplinaBtn.classList.add("action-button");
  excluirDisciplinaBtn.classList.add("bloquear");
  
  excluirDisciplinaBtn.addEventListener("click", () => {
    openDeleteModal(page,disciplina.idDisciplina);
  });
  
  actionColumn.appendChild(editarDisciplinaBtn);
  actionColumn.appendChild(excluirDisciplinaBtn);
  row.appendChild(actionColumn);
  //Action buttons
  return row;
}


const populateTable = (disciplinas,page) => {
  tableBody.innerHTML = ""; // Clear existing rows
  disciplinas.forEach((disciplina) => {
    const row = createDisciplinaRow(disciplina,page);
    tableBody.appendChild(row);
  });
};

async function getDisciplinasInfo(page,pageSize) {
  try {
    const disciplinas = await getAllDisciplinasWithPagination(page, pageSize);

    const { pageCount: countInPage, maxPage } = disciplinas;

    
    populateTable(disciplinas.disciplinas,page);
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
          getDisciplinasInfo(i, itemsPerPage);
      });
      paginationContainer.appendChild(button);
  }
}

document.addEventListener("DOMContentLoaded", async() => {
  let preloaderDiv = document.getElementById("pre-loader");

  await getDisciplinasInfo(1,itemsPerPageValue);
  preloaderDiv.style.display = "none";
});

cadastrarDisciplinaBtn.addEventListener('click',function(){
  openModal(modalCadastrarDisciplina);
});

cadastrarDisciplinaBtnSubmit.addEventListener('click',async function(e){
  const formCadastrarDisciplina = modalCadastrarDisciplina.querySelector('form');
  let disciplina = formCadastrarDisciplina.querySelector('#disciplina').value;
  let nomeProfessor = formCadastrarDisciplina.querySelector('#nome-professor').value;
  let curso = formCadastrarDisciplina.querySelector('#curso').value;
  let numeroAlunos = formCadastrarDisciplina.querySelector('#numero-alunos').value;
  let codigoDisciplina = formCadastrarDisciplina.querySelector('#codigo-disciplina').value;

  const disciplinaDTO = {
    nomeDisciplina:disciplina,
    professorDisciplina:nomeProfessor,
    curso:curso,
    quantidadeAluno:numeroAlunos,
    codigoDisciplina:codigoDisciplina
  };

   try{
     const retorno = await createDisciplina(disciplinaDTO);
     openModal(modalSuccess);
   }catch(e){
    
    openModal(modalWarning);
   }
});