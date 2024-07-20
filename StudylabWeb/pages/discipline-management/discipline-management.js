import { getAllDisciplinas } from "../../assets/js/lib/services/disciplina.js";

const modalExc = document.getElementById("modal-excluir");
const modalBan = document.getElementById("modal-banir");
const deleteButtons = document.querySelectorAll(".deletar");
const banButtons = document.querySelectorAll(".banir");
var modal = document.getElementById("modalConfirmacao");
const tableBody = document.querySelector("#disciplina-table tbody");

function openModal(elemento) {
  elemento.style.display = "flex";
}

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
    showModal();
  });
});


window.onclick = function(event) {
  if (event.target.classList.contains('modal-container')) {
    closeModal(event.target);
  }
};

function showModal() {
  modal.style.animationName = "slideIn";
  modal.style.display = "block"; 

  setTimeout(function() {
    modal.style.animationName = "slideOf"; 
    setTimeout(function() {
      modal.style.display = "none"; 
    }, 200); 
  }, 5000);
}

function createDisciplinaRow(disciplina) {
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
  //Action buttons
  return row;
}


const populateTable = (disciplinas) => {
  tableBody.innerHTML = ""; // Clear existing rows

  disciplinas.forEach((disciplina) => {
    const row = createDisciplinaRow(disciplina);
    tableBody.appendChild(row);
  });
};

async function getDisciplinasInfo(page,pageSize) {
  try {
    const disciplinas = await getAllDisciplinas(page, pageSize);
    populateTable(disciplinas);
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
}

document.addEventListener("DOMContentLoaded", async() => {
  let preloaderDiv = document.getElementById("pre-loader");
  await getDisciplinasInfo(1,10);
  preloaderDiv.style.display = "none";
});

