import { instance } from "./axios.js"
import { saveUserCredentials } from "./auth.js"

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

  instance
  .post(
    "/auth/login",
    {
      email: email,
      password: password,
    }
  )
  .then(function (res) {
    saveUserCredentials(res.data)
    window.location.href = "/pages/home-admin/home-admin.html";
  })
  .catch(function (_) {
    alert("E-mail ou senha inválidos.");
  })
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
