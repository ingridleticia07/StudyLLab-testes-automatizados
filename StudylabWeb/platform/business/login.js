import { login,authTokenIsValid } from "../../platform/repository/auth.js";
import {isEmptyString} from "../../common/services/validation";
import {AUTH_TOKEN,getCookie } from "../../platform/repository/auth.js";

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
    const isCookieLoginTokenValid = cookieLoginToken == sessionStorage.getItem(AUTH_TOKEN) ? 1 : 0;
    
    if (!isAuthenticated || isCookieLoginTokenValid == 0) {
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=');
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
      sessionStorage.clear();
      localStorage.clear();

      const res = await login(email, password);
      

      let user = JSON.parse(localStorage.getItem("user"));
      
      if(user.role == 1)
        window.location.href='http://localhost:5173';
      else
        window.location.href='http://localhost:5175';
      
    }else{
      alert("Você já está logado!");

      let user = JSON.parse(localStorage.getItem("user"));
      
      if(user.role == 1)
        window.location.href='http://localhost:5173';
      else
        window.location.href='http://localhost:5175';
      
    }
  } catch (error) {
    throw error;
  }
}