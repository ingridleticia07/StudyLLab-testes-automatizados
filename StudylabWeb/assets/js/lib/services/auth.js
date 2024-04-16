import { instance, addAuthorizationHeaderInterceptor, removeAuthorizationHeaderInterceptor } from "./axios.js";

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
    .catch(function (err) {
      console.log(err);
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
