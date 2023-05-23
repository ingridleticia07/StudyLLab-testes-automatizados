var togglePassword = document.getElementById("toggle-password");
const passwordInput = document.querySelector('#password');
const emailInput = document.querySelector('#email');
const registrationInput = document.querySelector('#registration');
const submitButton = document.querySelector('#button-submit'); 
const checkboxInput = document.querySelector('#checkbox');

submitButton.addEventListener('click', (event) => {
  event.preventDefault();
  const registration = registrationInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  
  if(!email || !password || !registration || !checkboxInput.checked){
    alert('Por favor, preencha todos os campos.');
    return;
  }

  if(registration.length > 8 || registration.length < 6){
    alert("Por favor, digite uma matrícula com a quantidade de dígitos correta!");
    registrationInput.style.border = '1px solid red';
    registrationInput.focus();
    return;
  }

  if(password.length < 6){
    alert("A senha deve ter no mínimo 6 digitos!");
    passwordInput.style.border = '1px solid red';
    passwordInput.focus();
    return;
  }

  if (!isValidEmail(email)) {
    alert('Por favor, digite um e-mail institucional válido.');
    emailInput.focus();
    return;
  }

alert('Login bem sucedido')

});

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@alu.ufc.br$/;
  return emailRegex.test(email);
}


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