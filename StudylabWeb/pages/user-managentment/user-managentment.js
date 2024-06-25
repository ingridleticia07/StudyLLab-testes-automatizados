import { getAllUsersInfo,deleteUser } from "../../assets/js/lib/services/user.js";
import { updateUserAuthState } from "../../assets/js/lib/services/auth.js";

updateUserAuthState();

const modalExc = document.getElementById("modal-excluir");
const modalBan = document.getElementById("modal-banir");
const banButtons = document.querySelectorAll(".banir");
const confirmDeleteButton = document.querySelector("#modal-excluir .confirmar");
const confirmBanButton = document.querySelector("#modal-banir .confirmar");
const tableBody = document.querySelector("#user-table tbody");

function openModal(elemento) {
  elemento.style.display = "flex";
}

function closeModal(elemento) {
  elemento.style.display = "none";
}

function openDeleteModal(userId) {
  openModal(modalExc);
  
  confirmDeleteButton.onclick = async function() {
    closeModal(modalExc);
    showModal(document.getElementById("modalConfirmacaoExcluir"));
    
    let userDeletedSuccessfully = false;
    let rowToRemove = tableBody.querySelector(`tr[id='${userId}']`)
    
    try{
      await deleteUser(userId)
      userDeletedSuccessfully = true;
    }catch(e){
      console.log(e);
    }

    if(userDeletedSuccessfully)
      tableBody.removeChild(rowToRemove);
  };
}

function openBanModal(userId) {
  openModal(modalBan);
  confirmBanButton.addEventListener("click", function () {
    closeModal(modalBan);
    showModal(document.getElementById("modalConfirmacaoBanir"));
  });
}

document.querySelectorAll(".fechar").forEach(function (botao) {
  botao.addEventListener("click", function () {
    const modal = botao.closest(".modal-container");
    closeModal(modal);
  });
});

window.onclick = function (event) {
  if (event.target.classList.contains("modal-container")) {
    closeModal(event.target);
  }
};

document.addEventListener("DOMContentLoaded", (event) => {
  const selectAllCheckbox = document.getElementById("select-all");
  selectAllCheckbox.addEventListener("change", function () {
    const userCheckboxes = document.querySelectorAll(
      '.user-table tbody input[type="checkbox"]'
    );
    userCheckboxes.forEach((checkbox) => {
      checkbox.checked = this.checked;
    });
  });
});

function showModal(modal) {
  modal.style.animationName = "slideIn";
  modal.style.display = "block";

  setTimeout(function () {
    modal.style.animationName = "slideOf";
    setTimeout(function () {
      modal.style.display = "none";
    }, 200);
  }, 5000);
}

async function getUsers(page,pageSize) {
  try {

    const data = await getAllUsersInfo(page, pageSize);

    const { users, pageCount: countInPage, usersCount: totalRecords, maxPage } = data;
    
    updatePageCount(totalRecords, countInPage, page, pageSize, maxPage);
    populateTable(users);
    addButtonsPagination(maxPage,countInPage);
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
            getUsers(i, itemsPerPage);
        });
        paginationContainer.appendChild(button);
    }
}

document.addEventListener("DOMContentLoaded", () => {
  const itemsPerPage = 10;
  getUsers(1,itemsPerPage);
});


const blockIcon = () => {
  const blockIcon = document.createElement("img");
  blockIcon.src = "../../assets/img/icon-edit.svg";
  blockIcon.alt = "Bloquear";

  return blockIcon;
};

const deleteIcon = () => {
  const deleteIcon = document.createElement("img");
  deleteIcon.src = "../../assets/img/icon-delete.svg";
  deleteIcon.alt = "Excluir";

  return deleteIcon;
};

function updatePageCount(recordsCount, countInPage, currentPageIndex, pageSize, maxPage) {
  //TODO: Implement pagination and update informations
  //console.log(recordsCount, countInPage, currentPageIndex, pageSize, maxPage);
}

const populateTable = (users) => {
  tableBody.innerHTML = ""; // Clear existing rows

  users.forEach((user) => {
    const row = createUserRow(user);
    tableBody.appendChild(row);
  });
};

function createUserRow(user) {
  //User informations
  const row = document.createElement("tr");
  row.id = user.id;
  const inputColumn = document.createElement("td");
  inputColumn.innerHTML = `<input type="checkbox" name="user">`;

  const idColumn = document.createElement("td");
  idColumn.textContent = user.id;

  const usernameColumn = document.createElement("td");
  usernameColumn.textContent = user.username;

  const cursoColumn = document.createElement("td");
  cursoColumn.textContent = user.curso.nome;

  const emailColumn = document.createElement("td");
  emailColumn.textContent = user.email;

  row.appendChild(inputColumn);
  row.appendChild(idColumn);
  row.appendChild(usernameColumn);
  row.appendChild(cursoColumn);
  row.appendChild(emailColumn);

  //Action buttons
  const actionColumn = document.createElement("td");

  const deleteButton = document.createElement("button");
  deleteButton.id = `delete-u-${user.id}`;
  deleteButton.classList.add("action-button");
  deleteButton.classList.add("deletar");
  deleteButton.appendChild(deleteIcon());
  deleteButton.addEventListener("click", () => {
    openDeleteModal(user.id);
  });

  const banButton = document.createElement("button");
  banButton.id = `ban-u-${user.id}`;
  banButton.classList.add("action-button");
  banButton.classList.add("banir");
  banButton.appendChild(blockIcon());
  banButton.addEventListener("click", () => {
    openBanModal(user.id);
  });

  actionColumn.appendChild(deleteButton);
  actionColumn.appendChild(banButton);
  row.appendChild(actionColumn);

  return row
}
