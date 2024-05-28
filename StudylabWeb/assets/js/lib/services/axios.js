import { api_key } from "../keys.js";

let unauthorizedInterceptor = undefined;
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

export function addUnauthorizedInterceptor(callback) {
  unauthorizedInterceptor = instance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response.status === 401) {
        callback();
      }

      return Promise.reject(error);
    }
  );
}

export function removeAuthorizationHeaderInterceptor() {
  if (!authorizationInterceptor) {
    return;
  }
  instance.interceptors.request.eject(authorizationInterceptor);
}