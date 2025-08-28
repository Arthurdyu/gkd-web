/**在api/interface目录定义好接口后，在moudules目录下实现具体的API请求函数 */
import http from "@/api";
import { SYS } from "@/api/config/servicePort";
import { Resource } from "../interface/resourcepage";

//世界地图数据
export function getWorldmapApi() {
  return http.get<Resource.ResWorldmap>(`${SYS}/resource/getWorldMapValue`);
}

//每年测序的基因组
export function getSequenceYearApi() {
  return http.get<Resource.ResSequenceYear>(`${SYS}/resource/getSequencesNumberPerYear`);
}

//血清型的数量
export function getSerovarApi() {
  return http.get<Resource.ResSerovar>(`${SYS}/resource/getSerovarPiechart`);
}
// 获取 Meta 表格数据列表
export function getMetaListApi(params?: Resource.ReqMetaList) {
  return http.get<Resource.ResMetaList>(`${SYS}/search/getMetaTable`, params);
}
