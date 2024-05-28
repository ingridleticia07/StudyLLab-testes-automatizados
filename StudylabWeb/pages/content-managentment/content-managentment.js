const modalExc = document.getElementById("modal-excluir");
const modalBan = document.getElementById("modal-banir");
const deleteButtons = document.querySelectorAll(".deletar");
const banButtons = document.querySelectorAll(".banir");
var modal = document.getElementById("modalConfirmacao");

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

