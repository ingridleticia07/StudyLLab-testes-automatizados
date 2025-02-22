import { login,authTokenIsValid } from "../../platform/repository/auth.js";
import {isEmptyString} from "../../common/services/validation";
import {getUserInfo } from "../../platform/repository/user.js";

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

    if (!isAuthenticated) {
      await login(email, password);
    }else{
      alert("Você já está logado!");
    }
  } catch (error) {
    console.error("Error during login process:", error);
  }
}