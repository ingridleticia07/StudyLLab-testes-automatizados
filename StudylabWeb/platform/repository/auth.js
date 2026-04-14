import {
  instance,
  addAuthorizationHeaderInterceptor,
  removeAuthorizationHeaderInterceptor,
} from "./axios.js";
import { getCursoCodeByName } from "../utils/curso_matcher.js";
import { getTipoUserByName } from "../utils/user_matcher.js";
import { getUserInfo, cleanUserInfo } from "./user.js";
import {cleanUserCredentials} from "../business/login";

export const AUTH_TOKEN = "authToken";
const AUTH_VARIABLE = "idUser";
const AUTH_ENDPOINT = "/auth";
const USER_INFO_STORAGE_KEY_TIME = "timeStorageKey";
export const LAST_USER_LOGIN = "email-user";

export async function login(email, password) {
  try {
    const res = await instance.post(AUTH_ENDPOINT + "/login", {
      email,
      password,
    });
    
    if (!localStorage.getItem('user') || !getCookie(LAST_USER_LOGIN)) {

      let user = JSON.parse(localStorage.getItem("user"));
      let timestampStr = localStorage.getItem("timeStorageKey");

      // Garante que os dados realmente existem e são válidos
      if (!user || !timestampStr || res.data.idUsuario != user.id || hasExpired(timestampStr) || !getCookie(LAST_USER_LOGIN)) {
        //console.log("Renovando credenciais, usuário anterior:", user);

        cleanUserCredentials();

        sessionStorage.setItem(AUTH_TOKEN, res.data.tokenJwt);
        sessionStorage.setItem(AUTH_VARIABLE, res.data.idUsuario);

        updateUserAuthState();

        await new Promise(resolve => setTimeout(resolve, 2000));

        await saveUserCredentials(
          res.data.tokenJwt,
          res.data.idUsuario, 
          email
        );
      }
    }

    return res;
  } catch (e) {
    throw e;
  }
}

export async function activateUserWithCode(code) {
  var idUser = getCookie('id-user');
  
  try {
    getUserInfo(idUser);

    const user = JSON.parse(localStorage.getItem("user"));
    const res = await instance.put(AUTH_ENDPOINT + "/sec/confirmEmail?idUser="+idUser, {
      confirmationCode:code
    });

    return user.role;

  } catch (e) {
    throw e;
  }
}

export async function register(
  username,
  email,
  password,
  matricula,
  cursoName
) {
  const cursoCode = getCursoCodeByName(cursoName);

  try {
    const res = await instance
    .post(AUTH_ENDPOINT + "/register", {
      username: username,
      email: email,
      password: password,
      matricula: matricula,
      role: 0,
      codeCurso: cursoCode,
    });
    
    saveUserCredentials(
      res.data.tokenJwt,
      res.data.idUsuario
    );

  } catch (error) {
    throw error;
  }
}

export async function registerAdminOrProf(
  username,
  email,
  password,
  matricula,
  cursoName,
  role
) {
  const cursoCode = getCursoCodeByName(cursoName);
  const roleCode = getTipoUserByName(role);

  try {
    const res = await instance
    .post(AUTH_ENDPOINT + "/registerProfOrAdmin", {
      username: username,
      email: email,
      password: password,
      matricula: matricula,
      role: roleCode,
      codeCurso: cursoCode,
    });
  

  } catch (error) {
    throw error;
  }
}

export async function resendConfirmationEmail(
  
) {

  try {
    const userId = getCookie('id-user')
    await instance.post(AUTH_ENDPOINT + "/sec/resendConfirmationEmail?userId="+userId);

  } catch (error) {
    throw error;
  }
}

export async function requestResetPasswordUser(
  userEmail
) {

  try {
    const res = await instance
    .post(AUTH_ENDPOINT + "/requestResetPassword", {
      userEmail: userEmail
    });
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);
    const expires = `expires=${expireDate.toUTCString()}`;

    document.cookie = `emailForReset=${userEmail}; path=/; ${expires};`;
  } catch (error) {
    throw error;
  }
}

export async function resetPasswordUser(
  userEmail,
  resetCode,
  newPassword
) {

  try {
    const res = await instance
    .put(AUTH_ENDPOINT + "/resetPassword", {
      userEmail: userEmail,
      resetCode:resetCode,
      newPassword:newPassword
    });


  } catch (error) {
    throw error;
  }
}

export function logout() {
  if (hasCredentialsSave()) {
    sessionStorage.removeItem(AUTH_TOKEN);
  }
  removeAuthorizationHeaderInterceptor();
  cleanUserInfo();
}

export function hasCredentialsSave() {
  return getUserCredentials() !== null;
}

export function getUserCredentials() {
  return sessionStorage.getItem(AUTH_TOKEN);
}

export async function authTokenIsValid() {
  updateUserAuthState();
  if (!hasCredentialsSave()) {
    return false;
  }

  try {
    await instance.get("/utils/authenticated");
    return true;
  } catch (error) {
    return false;
  }
}

export function updateUserAuthState() {
  if (hasCredentialsSave()) {
    addAuthorizationHeaderInterceptor(getUserCredentials());
  }
}

async function saveUserCredentials(tokenJwt, idUser, emailUser) {

  if (tokenJwt) {

    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);
    const expires = `expires=${expireDate.toUTCString()}`;
    const domain = ".studyllab.com.br";
    const path = "path=/";

    document.cookie = `id-user=${idUser}; ${path}; ${domain}; ${expires}; Secure; SameSite=None`;
    document.cookie = `email-user=${emailUser}; ${path}; ${domain}; ${expires}; Secure; SameSite=None`;
    document.cookie = `${AUTH_TOKEN}=${tokenJwt}; ${path}; ${domain}; ${expires}; Secure; SameSite=None`;

    await saveUsersInfos(tokenJwt, idUser);

  } else {
    console.log("No jwt token provided.");
  }
}

export function getCookie(name) {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find(row => row.startsWith(`${name}=`));
  return cookie ? cookie.split('=')[1] : null;
}

export async function saveUsersInfos(tokenJwt, idUser) {
  const timestampStr = localStorage.getItem(USER_INFO_STORAGE_KEY_TIME);

  if (!sessionStorage.getItem(AUTH_TOKEN) || !timestampStr) {
    sessionStorage.setItem(AUTH_TOKEN, getCookie(AUTH_TOKEN));
    await getUserInfo(getCookie('id-user'));
  }
}

export async function saveDashboardSessionInfos() {
  if (!sessionStorage.getItem(AUTH_TOKEN)) {
    sessionStorage.setItem(AUTH_TOKEN, getCookie(AUTH_TOKEN));
    addAuthorizationHeaderInterceptor(sessionStorage.getItem(AUTH_TOKEN))
    await getUserInfo(getCookie('id-user'), false);
  }
}

function hasExpired(timestampStr, expiryHours = 24) {
    const now = new Date().getTime();
    const savedTime = parseInt(timestampStr);
    const expiryTime = expiryHours * 60 * 60 * 1000;
    
    return (now - savedTime) > expiryTime;
}

export function logoutSession() {
  const domain = "domain=.studyllab.com.br";
  const path = "path=/";

  document.cookie.split(';').forEach(cookie => {
    const [name] = cookie.trim().split('=');

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; ${path}; ${domain}; Secure; SameSite=None`;
  });

  sessionStorage.clear();
  localStorage.clear();
}

