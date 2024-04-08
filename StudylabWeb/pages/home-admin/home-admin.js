import { logout, getUserInfo, updateUserAuthState } from "../../assets/js/lib/auth.js";

updateUserAuthState()

const user = await getUserInfo(); //TODO: Fazer cache das informações do usuário
console.log(user);

//Logout provisório
const userIcon = document.querySelector("#user-icon");
userIcon.addEventListener("click", () => {
    logout();
    alert("Saindo...")
    window.location.href = "/pages/login/login.html";
})