import request from "@/utils/request";
import qs from "qs";

export function getDicTree() {
  return request({
    url: "/train-stoptime/dictionary/region/tree",
    method: "get",
  });
}

export function getChildren(parentId, queryParam) {
  return request({
    url: `/train-stoptime/dictionary/search/${parentId}/${queryParam.page}/${queryParam.size}`,
    method: "get",
    params: qs.stringify(queryParam.params),
  });
}
export function postDictionary(data) {
  return request({
    url: "/train-stoptime/dictionary",
    method: "post",
    data: qs.stringify(data),
  });
}
export function updataDictionary(data) {
  return request({
    url: "/train-stoptime/dictionary",
    method: "put",
    data: qs.stringify(data),
  });
}
export function delDictionary(keyId) {
  return request({
    url: `/train-stoptime/dictionary/${keyId}`,
    method: "delete",
  });
}

export function getAllRegion() {
  return request({
    url: "/train-stoptime/dictionary/region/all",
    method: "get",
  });
}

export function searchByParentId(parentId) {
  return request({
    url: `/train-stoptime/dictionary/search/${parentId}`,
    method: "get",
  });
}
