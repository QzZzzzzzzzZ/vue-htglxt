import request from "@/utils/requestUserAuth";
import qs from "qs";
// const authUrl = "/auth-api";
const authUrl = "";

// 获取权限列表
export function getPerLists(userId) {
  return request({
    url: authUrl + `/getUserAuthority`,
    method: "get",
    params: userId,
    headers: {
      "fangda-appId": "train-stop-service",
    },
  });
}
