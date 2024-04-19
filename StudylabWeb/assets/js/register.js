import { register } from "./lib/services/auth.js";
import { userAllreadyLogged } from "./lib/utils/events_guards.js"

await userAllreadyLogged();

var togglePassword = document.getElementById("toggle-password");
const passwordInput = document.querySelector("#password");
const emailInput = document.querySelector("#email");
const registrationInput = document.querySelector("#registration");
const nameInput = document.querySelector("#username");
const cursoSelect = document.querySelector("#curso");
const submitButton = document.querySelector("#button-submit");
const checkboxInput = document.querySelector("#checkbox");

submitButton.addEventListener("click", (event) => {
  event.preventDefault();
  const username = nameInput.value.trim();
  const usercode = registrationInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const curso = cursoSelect.value;

  if (!email || !password || !usercode || !username || !checkboxInput.checked) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  if (usercode.length > 8 || usercode.length < 6) {
    alert(
      "Por favor, digite uma matrícula com a quantidade de dígitos correta!"
    );
    registrationInput.style.border = "1px solid red";
    registrationInput.focus();
    return;
  }

  if (password.length < 6) {
    alert("A senha deve ter no mínimo 6 digitos!");
    passwordInput.style.border = "1px solid red";
    passwordInput.focus();
    return;
  }

  if (!isValidEmail(email)) {
    alert("Por favor, digite um e-mail institucional válido.");
    emailInput.focus();
    return;
  }

  register(
    username,
    email,
    password,
    usercode,
    curso,
    function () {
      //TODO: Redirecionar para colocar o codigo que recebue por email. Bloquear o acesso a home-admin enquanto não confirmar o código
      window.location.href = "/pages/home-admin/home-admin.html";
    },
    function () {}
  );
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
    togglePassword.alt = "Mostrar senha";
  }
}
