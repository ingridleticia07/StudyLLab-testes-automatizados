import { logout, updateUserAuthState } from "../../assets/js/lib/services/auth.js";
import { getUserInfo } from "../../assets/js/lib/services/user.js";
import { addUnauthorizedInterceptor } from "../../assets/js/lib/services/axios.js";

addUnauthorizedInterceptor(() => {
    alert("Sessão expirada. Por favor, faça login novamente.")
    logout();
    window.location.href = "/pages/login/login.html";
})
updateUserAuthState()

const user = await getUserInfo(); //TODO: Fazer cache das informações do usuário

//Logout provisório
const userIcon = document.querySelector("#user-icon");
userIcon.addEventListener("click", () => {
    logout();
    alert("Saindo...")
    window.location.href = "/pages/login/login.html";
})