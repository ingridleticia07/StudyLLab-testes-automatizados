import { getAllUsersInfo } from "../../assets/js/lib/services/user.js";

const modalExc = document.getElementById("modal-excluir");
const modalBan = document.getElementById("modal-banir");
const banButtons = document.querySelectorAll(".banir");
const confirmDeleteButton = document.querySelector("#modal-excluir .confirmar");
const confirmBanButton = document.querySelector("#modal-banir .confirmar");

function openModal(elemento) {
  elemento.style.display = "flex";
}

function closeModal(elemento) {
  elemento.style.display = "none";
}

function openDeleteModal(userId) {
  openModal(modalExc);
  confirmDeleteButton.addEventListener("click", function () {
    closeModal(modalExc);
    showModal(document.getElementById("modalConfirmacaoExcluir"));
  });
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

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const data = await getAllUsersInfo(1, 10);
    populateTable(data);
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
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

const populateTable = (users) => {
  const tableBody = document.querySelector("#user-table tbody");
  tableBody.innerHTML = ""; // Clear existing rows

  users.forEach((user) => {
    const row = createUserRow(user);
    tableBody.appendChild(row);
  });
};

function createUserRow(user) {
  //User informations
  const row = document.createElement("tr");
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
