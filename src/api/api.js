import request from "@/utils/request";
import qs from "qs";
const baseUrl = "​/recode";
export function getAllRecord() {
  return request({
    url: baseUrl + `/getRecord/logistic`,
    method: "get",
  });
}
export function getRecordByTrackId(trackId) {
  return request({
    url: baseUrl + `/getRecordByTrackId/${trackId}`,
    method: "get",
  });
}
// 物流修改数据
export function modifyWl(data) {
  return request({
    url: "/recode/modify",
    method: "put",
    data: data,
  });
}
// 物流退回数据
export function backWl(recordId) {
  return request({
    url: `/recode/record-back/${recordId}`,
    method: "put",
    data: data,
  });
}
// 预排时间登记
export function arrangement(data) {
  return request({
    url: "/recode/reg-arrangement",
    method: "post",
    data: data,
  });
}
// 报空时间登记
export function completeEmpty(data) {
  return request({
    url: "/recode/reg-complete-empty",
    method: "post",
    data: data,
  });
}
// 装好时间登记
export function completePack(data) {
  return request({
    url: "​/recode​/reg-complete-pack",
    method: "post",
    data: data,
  });
}
// 取样完成时间登记
export function completeSample(data) {
  return request({
    url: "/recode/reg-complete-sample",
    method: "post",
    data: data,
  });
}
// 装好时间登记
export function leaveFactory(data) {
  return request({
    url: "/recode/reg-leave-factory",
    method: "post",
    data: data,
  });
}
// 送车时间登记
export function logiSend(data) {
  return request({
    url: "/recode/reg-logi-send",
    method: "post",
    data: data,
  });
}
