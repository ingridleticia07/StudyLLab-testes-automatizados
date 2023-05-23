const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const submitButton = document.querySelector('#button-submit');

submitButton.addEventListener('click', (event) => {
  event.preventDefault(); // previne o envio do formulário

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

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

  // Verifica se a senha tem pelo menos 6 caracteres
  if (password.length < 6) {
    alert('A senha deve ter pelo menos 6 caracteres.');
    passwordInput.focus();
    return;
  }

  // Se chegou até aqui, o formulário está válido
  alert('Login bem-sucedido!');
});

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@alu.ufc.br$/;
  return emailRegex.test(email);
}

var togglePassword = document.getElementById("toggle-password");


function togglePasswordVisibility() {

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      togglePassword.src = "/assets/img/eye-close.svg";
    } else {
      passwordInput.type = "password";
      togglePassword.src = "/assets/img/eye.svg";
      togglePassword.alt = "Mostrar senha"
    }
  }
