import { login } from "../../platform/repository/auth.js";
import {isEmptyString} from "../../common/services/validation";


export function validateLoginFields(setValidateField,field) {
  var fielNeedValidation = false;

  if(isEmptyString(field))
    fielNeedValidation = true;

  setValidateField(fielNeedValidation);
}

export function handleLogin(email, password) {
  try {
    login(email, password);
  } catch (error) {
    console.log(error);
  }
}