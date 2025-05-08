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
    const user = JSON.parse(localStorage.getItem("user"));
    const cookieLoginToken = getCookie(AUTH_TOKEN);

    if (!isAuthenticated || !cookieLoginToken) {
      await login(email, password);

      if(user.role == 1)
        window.location.href='http://localhost:5173';

    }else{
        alert("Você já está logado!");

      if(user.role == 1)
        window.location.href='http://localhost:5173';
    }
  } catch (error) {
    throw error;
  }
}