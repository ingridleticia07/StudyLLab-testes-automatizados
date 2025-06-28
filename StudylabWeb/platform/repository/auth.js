import {
  instance,
  addAuthorizationHeaderInterceptor,
  removeAuthorizationHeaderInterceptor,
} from "./axios.js";
import { getCursoCodeByName } from "../utils/curso_matcher.js";
import { getUserInfo, cleanUserInfo } from "./user.js";

export const AUTH_TOKEN = "authToken";
const AUTH_VARIABLE = "idUser";
const AUTH_ENDPOINT = "/auth";

export async function login(email, password) {
  try {
    const res = await instance.post(AUTH_ENDPOINT + "/login", {
      email,
      password,
    });
    
    saveUserCredentials(
      res.data.tokenJwt,
      res.data.tokenAntifogery,
      res.data.tokenAntifogeryCookie,
      res.data.idUsuario
    );

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
      res.data.tokenAntifogery,
      res.data.tokenAntifogeryCookie,
      res.data.idUsuario
    );

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
    const response = await instance.get("/utils/authenticated");
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

function saveUserCredentials(tokenJwt, tokenAntifogery = null, tokenAntifogeryCookie, idUser) {
  
  if (tokenAntifogery) {

    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);
    const expires = `expires=${expireDate.toUTCString()}`;

    document.cookie = `.AspNetCore.Antiforgery.KeSRHT2WmJs=${tokenAntifogeryCookie}; path=/; ${expires};`;
    document.cookie = `.csrf-token=${tokenAntifogery}; path=/; ${expires};`;
    document.cookie = `id-user=${idUser}; path=/; ${expires};`;
    document.cookie = `${AUTH_TOKEN}=${tokenJwt}; path=/; ${expires};`;
    saveDashboardSessionInfos(tokenJwt, idUser);

    console.log("Anti-forgery token saved.");
  } else {
    console.log("No anti-forgery token provided.");
  }

  // Save the JWT token in session storage
  sessionStorage.setItem(AUTH_TOKEN, tokenJwt);
  sessionStorage.setItem(AUTH_VARIABLE, idUser);
  // Optionally call a function to get user info
  getUserInfo(idUser);
}

export function getCookie(name) {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find(row => row.startsWith(`${name}=`));
  return cookie ? cookie.split('=')[1] : null;
}

export function saveDashboardSessionInfos(tokenJwt, idUser) {
  if (!sessionStorage.getItem(AUTH_TOKEN)) {
    sessionStorage.setItem(AUTH_TOKEN, getCookie(AUTH_TOKEN));
    getUserInfo(getCookie('id-user'));
  }
}

export function logoutSession() {
  document.cookie.split(';').forEach(cookie => {
    const [name] = cookie.trim().split('=');
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });

  sessionStorage.clear();
}

