import request from "@/utils/request";
import qs from "qs";

// 获取车辆数据
export function fetchList(data) {
  return request({
    url: "/train-stoptime/recode/getRecord/logistic",
    method: "get",
    params: data,
  });
}
// 获取报表数据
export function getAllRport(data) {
  return request({
    url: `/train-stoptime/recode/getRecord/report`,
    method: "get",
    params: data,
  });
}

export function fetchArticle() {
  return request({
    url: "/article/detail",
    method: "get",
  });
}

export function fetchPv(pv) {
  return request({
    url: "/article/pv",
    method: "get",
    params: { pv },
  });
}

export function createArticle(data) {
  return request({
    url: "/article/create",
    method: "post",
    data,
  });
}

export function updateArticle(data) {
  return request({
    url: "/article/update",
    method: "post",
    data,
  });
}
