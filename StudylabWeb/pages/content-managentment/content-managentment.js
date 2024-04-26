var modal = document.getElementById("modal-excluir");
var closeButton = document.getElementById("fechar");
var deleteButton = document.querySelectorAll(".deletar");
var cancelButton = document.getElementById("cancelarButton");
var confirmButton = document.getElementById("confirarmButton");


function openModal() {
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}

deleteButton.forEach(function(botao) {
    botao.addEventListener("click", function() {
        console.log("Botão deletar clicado!");
        openModal(0)
    });
});

modal.onclick = function() {
    closeModal();
}

closeButton.onclick = function() {
  closeModal();
};

cancelButton.onclick = function() {
  closeModal();
};

confirmButton.onclick = function() {
    closeModal();
}

