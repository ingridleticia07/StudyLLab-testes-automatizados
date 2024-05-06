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
}