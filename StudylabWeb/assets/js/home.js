// Selecionar elementos do DOM
const menuHamburguer = document.querySelector('.icon');
const menu = document.querySelector('.menu');

// Adicionar evento de clique ao menu hamburguer
menuHamburguer.addEventListener('click', function() {
  // Alternar a classe 'active' no menu
  menu.classList.toggle('active');
});


// Selecionar elementos do DOM
const closeBtn = document.querySelector('.close-btn');

// Adicionar evento de clique ao menu hamburguer
menuHamburguer.addEventListener('click', function() {
  // Exibir o menu e o botão de fechar
  menu.style.display = 'block';
  closeBtn.style.display = 'block';
});

// Adicionar evento de clique ao botão de fechar
closeBtn.addEventListener('click', function() {
  // Ocultar o menu e o botão de fechar
  menu.style.display = 'none';
  closeBtn.style.display = 'none';
});
