import request from "@/utils/request";
import qs from "qs";
const baseUrl = "/train-stoptime/usertrack";

export function getUserTrack() {
  return request({
    url: baseUrl,
    method: "get",
  });
}

export function addUser(data) {
  return request({
    url: baseUrl + "/add",
    method: "post",
    data: qs.stringify(data),
  });
}
// 查询用户区域信息
export function searchUser(userId) {
  return request({
    url: baseUrl + `/region/${userId}`,
    method: "get",
  });
}
// 查询用户区域信息下的股道信息
export function searchUserByParent(userId, parentId) {
  return request({
    url: baseUrl + `/search/${userId}/${parentId}`,
    method: "get",
  });
}
