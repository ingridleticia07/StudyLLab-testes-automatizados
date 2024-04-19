import { instance, addAuthorizationHeaderInterceptor, removeAuthorizationHeaderInterceptor } from "./axios.js";
import { getCursoCodeByName } from "../utils/curso_matcher.js"
const AUTH_TOKEN = "authToken";
const AUTH_ENDPOINT = "/auth";

export function login(email, password, thenCallback, catchCallback) {
  instance
    .post(AUTH_ENDPOINT + "/login", {
      email: email,
      password: password,
    })
    .then(function (res) {
      saveUserCredentials(res.data);
      thenCallback();
    })
    .catch(function () {
      catchCallback();
    });
}

export function register(username, email, password, matricula, cursoName, thenCallback, catchCallback) {
  const cursoCode = getCursoCodeByName(cursoName)

  instance
    .post(AUTH_ENDPOINT + "/register", {
      username: username,
      email: email,
      password: password,
      codigoUsuario: matricula,
      role: 0,
      codeCurso: cursoCode
    })
    .then(function (res) {
      saveUserCredentials(res.data);
      thenCallback();
    })
    .catch(function () {
      catchCallback();
    });
}

export function logout() {
  if(hasCredentialsSave()) {
    localStorage.removeItem(AUTH_TOKEN);
  }
  removeAuthorizationHeaderInterceptor()
  //TODO: Remove usuario do cache
}

export function hasCredentialsSave() {
  return getUserCredentials() !== null;
}

export function getUserCredentials() {
  return localStorage.getItem(AUTH_TOKEN);
}

export async function authTokenIsValid() {
  updateUserAuthState()
  if(!hasCredentialsSave()) {
    return false
  }

  const response = await instance.get("/utils/authenticated")

  return response.status === 200
}

export function updateUserAuthState() {
  if(hasCredentialsSave()) {
    addAuthorizationHeaderInterceptor(getUserCredentials())
  }
}

function saveUserCredentials(token) {
  localStorage.setItem(AUTH_TOKEN, token);
}