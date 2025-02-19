import { login } from "../../platform/repository/auth.js";

// Function to validate the email
export function validateEmail(email) {

  return { valid: true };
}

// Function to validate the password
export function validatePassword(password) {
  if (password.length < 8) {
    return { valid: false, message: "A senha deve ter pelo menos 8 caracteres." };
  }

  return { valid: true };
}

// Main login function
export function handleLogin(email, password) {
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);

  login(email, password);
}

// Function to toggle password visibility
export function togglePasswordVisibility(passwordInput, togglePassword) {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    togglePassword.src = "/assets/img/eye-close.svg";
  } else {
    passwordInput.type = "password";
    togglePassword.src = "/assets/img/eye.svg";
    togglePassword.alt = "Mostrar senha";
  }
}
