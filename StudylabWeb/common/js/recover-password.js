const emailInput = document.querySelector('#email');
const submitButton = document.querySelector('#button-submit');

submitButton.addEventListener('click', (event) => {
    event.preventDefault(); // previne o envio do formulário

      // Verifica se o campo de e-mail está vazio
  if (!email) {
    alert('Por favor, digite seu e-mail.');
    emailInput.focus();
    return;
  }
      // Verifica se o email é válido
  if (!isValidEmail(email)) {
    alert('Por favor, digite um e-mail institucional válido.');
    emailInput.focus();
    return;
  }
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@alu.ufc.br$/;
    return emailRegex.test(email);
  }