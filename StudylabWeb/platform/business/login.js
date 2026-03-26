import { login,authTokenIsValid } from "../../platform/repository/auth.js";
import {isEmptyString} from "../../common/services/validation";
import {AUTH_TOKEN,getCookie,LAST_USER_LOGIN } from "../../platform/repository/auth.js";

export function validateLoginFields(setValidateField,field) {
  var fielNeedValidation = false;

  if(isEmptyString(field))
    fielNeedValidation = true;
  setValidateField(fielNeedValidation);
}

async function checkAuth() {
  const isValid = await authTokenIsValid();
  return isValid;
}

export async function handleLogin(email, password) {
  try {
    const isAuthenticated = await checkAuth();
    const cookieLoginToken = getCookie(AUTH_TOKEN);
    const lastUserLogin = getCookie(LAST_USER_LOGIN);
    const isCookieLoginTokenValid = cookieLoginToken == sessionStorage.getItem(AUTH_TOKEN) ? 1 : 0;
    const isNewUser = lastUserLogin != email ? 1 : 0;
    
    if (!isAuthenticated || isCookieLoginTokenValid == 0 || isNewUser == 1) {

      await login(email, password);
      
      let user = JSON.parse(localStorage.getItem("user"));
      
      if(user.role == 1)
        window.location.href='https://admin.studyllab.com.br/';
      else
        window.location.href='https://student.studyllab.com.br/';
      
    }else{
      alert("Você já está logado!");

      let user = JSON.parse(localStorage.getItem("user"));
      
      if(user.role == 1)
        window.location.href='https://admin.studyllab.com.br/';
      else
        window.location.href='https://student.studyllab.com.br/';
      
    }
  } catch (error) {
    throw error;
  }
}

export function cleanUserCredentials() {
  const cookies = document.cookie.split(';');

  cookies.forEach(cookie => {
    const [name] = cookie.trim().split('=');

    // Remove com domínio compartilhado
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.studyllab.com.br; Secure; SameSite=None`;

    // Fallback (caso algum tenha sido criado sem domain)
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  });

  sessionStorage.clear();
  localStorage.clear();
}