import request from "@/utils/request";

export function getDicTree() {
  return request({
    url: "/train-stoptime/dictionary/region/tree",
    method: "get",
  });
}
