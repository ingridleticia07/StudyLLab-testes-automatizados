import { login, hasCredentialsSave, authTokenIsValid, logout } from "./lib/services/auth.js";

if(await authTokenIsValid()) {
  alert("Você já está logado.")
  window.location.href = "/pages/home-admin/home-admin.html";
}
else {
  logout()
}

const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const submitButton = document.querySelector("#button-submit");

submitButton.addEventListener("click", (event) => {
  event.preventDefault(); // previne o envio do formulário

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Verifica se o campo de e-mail está vazio
  if (!email) {
    alert("Por favor, digite seu e-mail.");
    emailInput.focus();
    return;
  }

  // Verifica se o email é válido
  if (!isValidEmail(email)) {
    alert("Por favor, digite um e-mail institucional válido.");
    emailInput.focus();
    return;
  }

  if (password.length < 8) {
    alert("A senha deve ter pelo menos 8 caracteres.");
    passwordInput.focus();
    return;
  }

  login(
    email,
    password,
    function () {
      window.location.href = "/pages/home-admin/home-admin.html";
    },
    function () {}
  );
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
    togglePassword.alt = "Mostrar senha";
  }
}
