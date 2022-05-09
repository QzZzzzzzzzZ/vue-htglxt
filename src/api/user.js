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
//  根据姓名 拼音 电话查询用户
export function getUser(query) {
  return request({
    url: authUrl + `/auth/user/listUser?query=${query}`,
    method: "get",
  });
}
