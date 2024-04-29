const modalExc = document.getElementById("modal-excluir");
const modalBan = document.getElementById("modal-banir");
const deleteButtons = document.querySelectorAll(".deletar");
const banButtons = document.querySelectorAll(".banir");

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
  });
});


window.onclick = function(event) {
  if (event.target.classList.contains('modal-container')) {
    closeModal(event.target);
  }
};


document.addEventListener('DOMContentLoaded', (event) => {
  // Selecionar todos os checkboxes quando o checkbox do cabeçalho é marcado
  const selectAllCheckbox = document.getElementById('select-all');
  selectAllCheckbox.addEventListener('change', function() {
    const userCheckboxes = document.querySelectorAll('.user-table tbody input[type="checkbox"]');
    userCheckboxes.forEach((checkbox) => {
      checkbox.checked = this.checked;
    });
  });
});
