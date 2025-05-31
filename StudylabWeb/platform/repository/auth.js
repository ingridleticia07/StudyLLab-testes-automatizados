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

export async function register(
  username,
  email,
  password,
  matricula,
  cursoName,
  thenCallback,
  catchCallback
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
    document.cookie = `.AspNetCore.Antiforgery.KeSRHT2WmJs=${tokenAntifogeryCookie}; path=/;`;
    document.cookie = `.csrf-token=${tokenAntifogery}; path=/;`;
    document.cookie = `id-user=${idUser}; path=/;`;
    document.cookie = `${AUTH_TOKEN}=${tokenJwt}; path=/;`;
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

