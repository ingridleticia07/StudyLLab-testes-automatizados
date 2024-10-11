const modalExc = document.getElementById("modal-excluir");
const deleteButtons = document.querySelectorAll(".deletar");
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

document.addEventListener("DOMContentLoaded", function() {
  const filterButton = document.querySelector(".filter-button");
  const dropdownContent = document.querySelector(".dropdown-content");
  const allFilterOptions = document.querySelectorAll('.filter-options');

  filterButton.addEventListener("click", function(event) {
    dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
    allFilterOptions.forEach(option => option.style.display = "none"); 
    event.stopPropagation(); 
  });

  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function(event) {
      const targetId = item.getAttribute('data-target');
      const targetElement = document.getElementById(targetId);

      allFilterOptions.forEach(option => {
        if (option === targetElement) {
          option.style.display = option.style.display === "block" ? "none" : "block";
        } else {
          option.style.display = "none";
        }
      });

      event.stopPropagation(); 
    });
  });

  // Fechar todos os menus quando clicado fora deles
  window.addEventListener("click", function(event) {
    if (!event.target.matches('.filter-button') && !event.target.closest('.dropdown-content') && !event.target.closest('.filter-options')) {
      dropdownContent.style.display = "none";
      allFilterOptions.forEach(option => option.style.display = "none");
    }
  });
});
 
document.addEventListener('DOMContentLoaded', (event) => {
  const selectAllCheckbox = document.getElementById('select-all');
  selectAllCheckbox.addEventListener('change', function() {
    const userCheckboxes = document.querySelectorAll('.table tbody input[type="checkbox"]');
    userCheckboxes.forEach((checkbox) => {
      checkbox.checked = this.checked;
    });
  });
});