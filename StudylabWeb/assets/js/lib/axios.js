import { api_key } from "./keys.js";

export const instance = axios.create({
  baseURL: "http://localhost:7125",
  headers: {
    "x-api-key": api_key,
  },
});

let authorizationInterceptor = undefined;
export function addAuthorizationHeaderInterceptor(value) {
  removeAuthorizationHeaderInterceptor();
  authorizationInterceptor = instance.interceptors.request.use(function (
    config
  ) {
    config.headers.Authorization = "Bearer " + value;

    return config;
  });
}

export function removeAuthorizationHeaderInterceptor() {
  if (!authorizationInterceptor) {
    return;
  }
  instance.interceptors.request.eject(authorizationInterceptor);
}
