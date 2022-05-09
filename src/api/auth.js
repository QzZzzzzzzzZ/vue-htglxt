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

export function searchUser(userId) {
  return request({
    url: baseUrl + `/region/${userId}`,
    method: "get",
  });
}
export function searchUserByParent(userId, parentId) {
  return request({
    url: baseUrl + `/search/${userId}/${parentId}`,
    method: "get",
  });
}
