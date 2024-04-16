import { instance } from "./axios.js";
import User from "../models/user_model.js";

const USER_ENDPOINT = "/user"

export async function getUserInfo() {
    let response = await instance.get(USER_ENDPOINT + "/profile");
    console.log(response);
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