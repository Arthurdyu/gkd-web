// src/api/modules/searchpage.ts

import http from "@/api";
import { SYS } from "@/api/config/servicePort";
import { Search } from "../interface/searchpage";
import { Resource } from "../interface/resourcepage";

// ARG  entropy

// 支持 config 作为第三个参数，export 标记应传递到 config
export function getArgAllEntropyListApi(params?: Resource.ReqArgEntropyCountList, config?: any) {
  return http.get<Resource.ResArgEntropyCountList>(`${SYS}/search/getArgEntropyCountTable`, params, config);
}

// 获取 ARG 血清型 熵值表格数据列表
export function getArgSerovarEntropyListApi(params?: Search.ReqArgSerovarEntropyList, config?: any) {
  return http.get<Search.ResArgSerovarEntropyList>(`${SYS}/search/getArgSerovarEntropyTable`, params, config);
}

// 获取 ARG Country Entropy 表格数据列表
export function getArgCountryEntropyListApi(params?: Search.ReqArgCountryEntropyList, config?: any) {
  return http.get<Search.ResArgCountryEntropyList>(`${SYS}/search/getArgCountryEntropyTable`, params, config);
}

// 获取 ARG Host Entropy 表格数据列表
export function getArgHostEntropyListApi(params?: Search.ReqArgHostEntropyList, config?: any) {
  return http.get<Search.ResArgHostEntropyList>(`${SYS}/search/getArgHostEntropyTable`, params, config);
}
