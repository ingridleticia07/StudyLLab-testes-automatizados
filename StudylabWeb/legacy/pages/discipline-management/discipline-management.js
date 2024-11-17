const modalExc = document.getElementById("modal-excluir");
const modalEditar = document.getElementById("modal-editar");
const modalAdicionar = document.getElementById("modal-adicionar");
const adicButton = document.getElementById("cadastrar-btn");
const deleteButtons = document.querySelectorAll(".deletar");
const editButtons = document.querySelectorAll(".editar");
const confirmDeleteButton = document.querySelector("#modal-excluir .confirmar");
const confirmEditButton = document.querySelector("#modal-editar .confirmar");
const confirmCadastroButton = document.querySelector("#modal-adicionar .confirmar");
var modal = document.getElementById("modalConfirmacao");

function openModal(elemento) {
  elemento.style.display = "flex";
}

function closeModal(elemento) {
  elemento.style.display = "none";
}

adicButton.addEventListener("click", function() {
  openModal(modalAdicionar);
  confirmCadastroButton.addEventListener("click", function() {
    closeModal(modalAdicionar);
    showModal(document.getElementById('modalConfirmacaoAdicionar'));
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

editButtons.forEach(function(botao) {
  botao.addEventListener("click", function() {
    openModal(modalEditar);
    confirmEditButton.addEventListener("click", function() {
      closeModal(modalEditar);
      showModal(document.getElementById('modalConfirmacaoEditar'));
    });
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

window.onclick = function(event) {
  if (event.target.classList.contains('modal-container')) {
    closeModal(event.target);
  }
};

function showModal(modal) {
  modal.style.animationName = "slideIn";
  modal.style.display = "block"; 

  setTimeout(function() {
    modal.style.animationName = "slideOf"; 
    setTimeout(function() {
      modal.style.display = "none"; 
    }, 200); 
  }, 5000);
}

document.addEventListener('DOMContentLoaded', (event) => {
  const selectAllCheckbox = document.getElementById('select-all');
  selectAllCheckbox.addEventListener('change', function() {
    const userCheckboxes = document.querySelectorAll('.discipline-table tbody input[type="checkbox"]');
    userCheckboxes.forEach((checkbox) => {
      checkbox.checked = this.checked;
    });
  });
});