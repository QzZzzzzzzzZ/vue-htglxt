import request from "@/utils/request2";
import qs from "qs";
// const authUrl = "/auth-api";
const authUrl = "";

export function login(data) {
  return request({
    url: authUrl + `/auth/login`,
    method: "post",
    data: qs.stringify(data),
    headers: {
      Accept: "application/json,text/plain,*/*",
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });
}

export function getInfo(token) {
  return request({
    url: authUrl + `/auth/user`,
    method: "get",
  });
}

export function logout() {
  return request({
    url: "/vue-admin-template/user/logout",
    method: "post",
  });
}
