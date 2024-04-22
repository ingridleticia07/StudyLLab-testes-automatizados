import { instance } from "./axios.js";
import User from "../models/user_model.js";

const USER_ENDPOINT = "/user";
const USER_INFO_STORAGE_KEY = "user";

export async function getUserInfo() {
  let cachedUserInfo = getUserInfoCached();
  if(cachedUserInfo !== null) {
    return cachedUserInfo
  }
  let response = await instance.get(USER_ENDPOINT + "/profile");
  if (response.status !== 200) {
    return null;
  }

  let userInfo = new User(
    response.data.id,
    response.data.username,
    response.data.email,
    response.data.role,
    response.data.active,
    response.data.curso
  );

  saveUserInfo(userInfo);
  return userInfo;
}

function getUserInfoCached() {
  if(!hasUserInfoSaved()) {
    return null;
  }

  let cachedInfo = localStorage.getItem(USER_INFO_STORAGE_KEY);
  return JSON.parse(cachedInfo);
}

function saveUserInfo(data) {
  localStorage.setItem(USER_INFO_STORAGE_KEY, JSON.stringify(data));
}

function hasUserInfoSaved() {
  return localStorage.getItem(USER_INFO_STORAGE_KEY) !== null;
}

export function cleanUserInfo() {
  localStorage.removeItem(USER_INFO_STORAGE_KEY);
}