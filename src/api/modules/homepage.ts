import http from "@/api";
import { SYS } from "@/api/config/servicePort";
import { Homepage } from "../interface/homepage";


//首页
export function infoListApi() {
  return http.get<Homepage.Home.ResHome>(`${SYS}/information/ws/list`);
}
