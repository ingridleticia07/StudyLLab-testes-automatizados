import { instance } from "./axios.js";
import User from "../../common/models/user_model.js";
import { getCursoCodeByName } from "../utils/curso_matcher.js";
import { getTipoUserByName } from "../utils/user_matcher.js";

const USER_ENDPOINT = "/user";
const USER_INFO_STORAGE_KEY = "user";

export async function getUserInfo(idUser) {
  let cachedUserInfo = getUserInfoCached();
  if(cachedUserInfo !== null) {
    return cachedUserInfo
  }
  let response = await instance.get(USER_ENDPOINT + "/profile?idUsuario="+idUser);
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

export async function getAllUsersInfo(page, pageSize) {
  let response = await instance.get(USER_ENDPOINT + "?page="+page+"&pageSize="+pageSize);

  if (response.status !== 200) {
    return null;
  }
  return response.data;
}

export async function deleteUser(id) {
  let response = await instance.delete(USER_ENDPOINT + "/" + id);

  return response.status !== 200
}

export async function changeUserStatus(id,status) {
  let response = await instance.put(USER_ENDPOINT + "/" + id,{
    active:status
  })
  .then(function(res){

  }).catch(function(error){
    console.log(error);
  });

}

export async function changeUser(userDTO) {
  let statusBooleano = (userDTO.status === "true");

  let response = await instance.put(USER_ENDPOINT + "/" + userDTO.id,{
    username:userDTO.nome,
    codeCurso:getCursoCodeByName(userDTO.curso),
    active:statusBooleano,
    role:getTipoUserByName(userDTO.role)
  })
  .then(function(res){

  }).catch(function(error){
    console.log(error);
  });

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