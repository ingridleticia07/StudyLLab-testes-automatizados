import { authTokenIsValid, logout } from "../services/auth.js";

export async function userAllreadyLogged() {
  if (await authTokenIsValid()) {
    alert("Você já está logado.");
    window.location.href = "/pages/home-admin/home-admin.html";
  } else {
    logout();
  }
}
