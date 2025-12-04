/**在api/interface目录定义好接口后，在moudules目录下实现具体的API请求函数 */
import http from "@/api";
import { SYS } from "@/api/config/servicePort";
import { Resource } from "../interface/resourcepage";

//世界地图数据
export function getWorldmapApi(params?: any) {
  return http.get<Resource.ResWorldmap>(`${SYS}/resource/getWorldMapValue`, params);
  //路径：resource/getWorldMapValue 是apifox中世界地图的接口的路径
}
//宿主数据
export function getHostApi() {
  return http.get<Resource.ResHost>(`${SYS}/resource/getHostList`);
}

//每年测序的基因组
export function getSequenceYearApi() {
  return http.get<Resource.ResSequenceYear>(`${SYS}/resource/getSequencesNumberPerYear`);
}

//血清型的数据
export function getSerovarApi(params?: any) {
  return http.get<Resource.ResSerovar>(`${SYS}/resource/getSerovarPiechart`, params);
}

//ST型数据
export function getSTApi() {
  return http.get<Resource.ResST>(`${SYS}/resource/getSTPiechart`);
}

// 获取桑基图数据
export function getSankeyApi() {
  return http.get<Resource.ResSankey>(`${SYS}/resource/getSerovarSTCorrespondence`);
}

// 获取 Meta 表格数据列表
export function getMetaListApi(params?: Resource.ReqMetaList) {
  return http.get<Resource.ResMetaList>(`${SYS}/search/getMetaTable`, params);
}

// 获取 ARG 熵值表格数据列表
export function getArgEntropyCountListApi(params?: Resource.ReqArgEntropyCountList) {
  return http.get<Resource.ResArgEntropyCountList>(`${SYS}/search/getArgEntropyCountTable`, params);
}
