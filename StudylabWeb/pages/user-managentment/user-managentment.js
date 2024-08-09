import { getAllUsersInfo,deleteUser,changeUserStatus } from "../../assets/js/lib/services/user.js";
import { updateUserAuthState } from "../../assets/js/lib/services/auth.js";

updateUserAuthState();

const modalExc = document.getElementById("modal-excluir");
const modalBloquear = document.getElementById("modal-bloquear");
const banButtons = document.querySelectorAll(".banir");
const confirmDeleteButton = document.querySelector("#modal-excluir .confirmar");
const confirmBlockButton = document.querySelector("#modal-bloquear .confirmar");
const tableBody = document.querySelector("#user-table tbody");
const itemsPerPageValue = 5;

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
    
    let userDeletedSuccessfully = false;
    let rowToRemove = tableBody.querySelector(`tr[id='${userId}']`);
    
    try{
      await deleteUser(userId)

      userDeletedSuccessfully = true;

      showModal(document.getElementById("modalConfirmacaoExcluir"));
    }catch(e){
      showModal(document.getElementById("modalErroAoExcluir"));
    }
    
    if(userDeletedSuccessfully)
      tableBody.removeChild(rowToRemove);
  };
}

function openBanModal(userId) {
  openModal(modalBloquear);

  let userBlockedSuccessfully = false;
  let rowToBlock = tableBody.querySelector(`tr[id='${userId}']`);
  let iconElement = rowToBlock.querySelector(`#ban-u-${userId} img`);
  let tituloElement = modalBloquear.querySelector('header .subtitulo');
  let textoElement = modalBloquear.querySelector('div #texto');
  let currentUserStatus = rowToBlock.children[5];
  let btnConfirmElement = modalBloquear.querySelector('.btn.confirmar');
  let tituloModal = "";
  let textoModal = "";
  let btnModal = "";
  if(currentUserStatus.textContent == "true"){
    tituloModal = "Confirmar bloqueio de usuário";
    textoModal = "Deseja bloquear esse usuário?";
    btnModal = "Bloquear";
  }else{
    tituloModal = "Confirmar desbloqueio de usuário";
    textoModal = "Deseja desbloquear esse usuário?";
    btnModal = "Desbloquear";
  }
  
  tituloElement.textContent = tituloModal;
  textoElement.textContent = textoModal;
  btnConfirmElement.textContent = btnModal;
  confirmBlockButton.onclick = async function() {

    try{

      let newStatus;
      
      if(currentUserStatus.textContent == "true"){
        newStatus = false;
        iconElement.src = "../../assets/img/icon-unblock.png";
        iconElement.alt = "Desbloquear";
      }else{
        newStatus = true;
        iconElement.src = "../../assets/img/icon-edit.svg";
        iconElement.alt = "Bloquear";
      }
      currentUserStatus.textContent = newStatus;

      closeModal(modalBloquear);

      await changeUserStatus(userId,newStatus)

      showModal(document.getElementById("modalConfirmacaoBloqueioUsuario"));
    }catch(e){
      console.log(e);
      showModal(document.getElementById("modalErroAoBloquearUsuario"));
    }

  };
};

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

document.addEventListener("DOMContentLoaded", async() => {
  let preloaderDiv = document.getElementById("pre-loader");

  await getUsers(1,itemsPerPageValue);

  preloaderDiv.style.display = "none";
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

const unblockIcon = () => {
  const unblockIcon = document.createElement("img");
  unblockIcon.src = "../../assets/img/icon-unblock.png";
  unblockIcon.alt = "Desbloquear";

  return unblockIcon;
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

  const statusColumn = document.createElement("td");
  statusColumn.textContent = user.active;

  row.appendChild(inputColumn);
  row.appendChild(idColumn);
  row.appendChild(usernameColumn);
  row.appendChild(cursoColumn);
  row.appendChild(emailColumn);
  row.appendChild(statusColumn);
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
  banButton.classList.add("bloquear");

  if(user.active)
    banButton.appendChild(blockIcon());
  else
    banButton.appendChild(unblockIcon());
  banButton.addEventListener("click", () => {
    openBanModal(user.id);
  });

  actionColumn.appendChild(deleteButton);
  actionColumn.appendChild(banButton);
  row.appendChild(actionColumn);

  return row
}
