import { instance, addAuthorizationHeaderInterceptor, removeAuthorizationHeaderInterceptor } from "./axios.js";
import User from "./models/user_model.js";

const AUTH_TOKEN = "authToken";

export function login(email, password, thenCallback, catchCallback) {
  instance
    .post("/auth/login", {
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
  localStorage.removeItem(AUTH_TOKEN);
  removeAuthorizationHeaderInterceptor()
  //TODO: Remove usuario do cache
}

export function hasCredentialsSave() {
  return getUserCredentials() !== null;
}

export function getUserCredentials() {
  return localStorage.getItem(AUTH_TOKEN);
}

export async function getUserInfo() {
  let response = await instance.get("/user/profile");
  if(response.status !== 200) {
    return null;
  }

  let userInfo = new User(
    response.data.id,
    response.data.usename,
    response.data.email,
    response.data.role,
    response.data.activate,
    response.data.curso
  );

  return userInfo;
}

export function updateUserAuthState() {
  if(hasCredentialsSave()) {
    addAuthorizationHeaderInterceptor(getUserCredentials())
  }
}

function saveUserCredentials(token) {
  localStorage.setItem(AUTH_TOKEN, token);
}
