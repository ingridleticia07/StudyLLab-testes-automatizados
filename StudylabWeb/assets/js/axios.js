import { api_key } from "./keys.js";

export const instance = axios.create({
  baseURL: "http://localhost:7125",
  headers: {
    "x-api-key": api_key,
  },
});
