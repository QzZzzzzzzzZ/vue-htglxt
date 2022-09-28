import request from "@/utils/request";
import qs from "qs";
const baseUrl = "/train-stoptime/recode";
export function getAllRecord() {
  return request({
    url: baseUrl + `/getRecord/logistic`,
    method: "get",
  });
}

export function getRecordByTrackId(trackId, data) {
  return request({
    url: baseUrl + `/getRecordByTrackId/${trackId}`,
    method: "get",
    params: data,
  });
}
// 物流修改数据
export function modifyWl(data) {
  return request({
    url: baseUrl + "/modify",
    method: "put",
    params: data,
    // data: data,
  });
}
// 物流退回数据
export function backWl(recordId) {
  return request({
    url: baseUrl + `/record-back/${recordId}`,
    method: "put",
  });
}
// 预排时间登记
export function arrangement(data) {
  return request({
    url: baseUrl + "/reg-arrangement",
    method: "post",
    params: data,
  });
}
// 报空时间登记
export function completeEmpty(data) {
  return request({
    url: baseUrl + "/reg-complete-empty",
    method: "post",
    params: data,
  });
}
// 装好时间登记
export function completePack(data) {
  return request({
    url: baseUrl + "/reg-complete-pack",
    method: "post",
    params: data,
  });
}
// 取样完成时间登记
export function completeSample(data) {
  return request({
    url: baseUrl + "/reg-complete-sample",
    method: "post",
    params: data,
  });
}
// 出厂时间登记
export function leaveFactory(data) {
  return request({
    url: baseUrl + "/reg-leave-factory",
    method: "post",
    params: data,
  });
}
// 送车时间登记
export function loginSend(data) {
  return request({
    url: baseUrl + `/reg-logi-send`,
    method: "post",
    params: data,
  });
}
