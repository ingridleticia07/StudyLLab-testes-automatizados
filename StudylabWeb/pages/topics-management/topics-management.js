import { getAllTopicosDisciplina} from "../../assets/js/lib/services/topico.js";

const tableBody = document.querySelector("#disciplina-table tbody");
const itemsPerPageValue = 5;

window.onclick = function(event) {
  if (event.target.classList.contains('modal-container')) {
    closeModal(event.target);
  }
};

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

  const excluirTopicoBtn = document.createElement("button");
  excluirTopicoBtn.id = `disciplina-u-${disciplina.idDisciplina}`;
  excluirTopicoBtn.appendChild(excluirIcon());
  excluirTopicoBtn.classList.add("action-button");
  excluirTopicoBtn.classList.add("bloquear");
  
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
      });
      paginationContainer.appendChild(button);
  }
}

document.addEventListener("DOMContentLoaded", async() => {
  let preloaderDiv = document.getElementById("pre-loader");
  await getTopicosInfo(1,itemsPerPageValue);
  preloaderDiv.style.display = "none";
});
