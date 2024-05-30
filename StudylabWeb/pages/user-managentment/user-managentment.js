import { getAllUsersInfo } from "../../assets/js/lib/services/user.js";

const modalExc = document.getElementById("modal-excluir");
const modalBan = document.getElementById("modal-banir");
const deleteButtons = document.querySelectorAll(".deletar");
const banButtons = document.querySelectorAll(".banir");
const confirmDeleteButton = document.querySelector("#modal-excluir .confirmar");
const confirmBanButton = document.querySelector("#modal-banir .confirmar");

function openModal(elemento) {
  elemento.style.display = "flex";
}

function closeModal(elemento) {
  elemento.style.display = "none";
}

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

deleteButtons.forEach(function(botao) {
  botao.addEventListener("click", function() {
    openModal(modalExc);
    confirmDeleteButton.addEventListener("click", function() {
        closeModal(modalExc);
        showModal(document.getElementById('modalConfirmacaoExcluir'));
    });
  });
});

banButtons.forEach(function(botao) {
  botao.addEventListener("click", function() {
    openModal(modalBan);
    confirmBanButton.addEventListener("click", function() {
        closeModal(modalBan);
        showModal(document.getElementById('modalConfirmacaoBanir'));
    });
  });
});


window.onclick = function(event) {
  if (event.target.classList.contains('modal-container')) {
    closeModal(event.target);
  }
};


document.addEventListener('DOMContentLoaded', (event) => {
  const selectAllCheckbox = document.getElementById('select-all');
  selectAllCheckbox.addEventListener('change', function() {
    const userCheckboxes = document.querySelectorAll('.user-table tbody input[type="checkbox"]');
    userCheckboxes.forEach((checkbox) => {
      checkbox.checked = this.checked;
    });
  });
});

function showModal(modal) {
  modal.style.animationName = "slideIn";
  modal.style.display = "block"; 

  setTimeout(function() {
    modal.style.animationName = "slideOf"; 
    setTimeout(function() {
      modal.style.display = "none"; 
    }, 200); 
  }, 5000);
};

document.addEventListener('DOMContentLoaded', async function() {
  
  try {
    const data = await getAllUsersInfo(1,1);
    populateTable(data);
    
  } catch (error) {
    console.error('Error fetching user info:', error);
  }
});

const populateTable = (users) =>{
  const tableBody = document.querySelector('#user-table tbody');
  tableBody.innerHTML = ''; // Clear existing rows

  users.forEach(user => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td><input type="checkbox" name="user"></td>
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${user.curso.nome}</td>
      <td>${user.email}</td>
      <td>
        <button class="action-button banir"><img src="../../assets/img/icon-edit.svg" alt="Bloquear"></button>
        <button class="action-button deletar"><img src="../../assets/img/icon-delete.svg" alt="Excluir"></button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}