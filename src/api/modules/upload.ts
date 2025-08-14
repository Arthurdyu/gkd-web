import http from "@/api";
import { OSS, SYS } from "@/api/config/servicePort";
/**
 * @name 文件上传模块
 */
// 图片上传
export const uploadFile = (params: FormData) => {
  return http.post<Upload.ResFileUrl>(`${OSS}/file/upload`, params, { cancel: false });
};
export const uploadUrl = `${OSS}/file/upload`;

export const getPDFFile = (params: Upload.ReqPDF) => {
  return http.get<Upload.ResPDF>(`${SYS}/uefilehtml/${params.id}`);
};

export const downLoadPDFFile = (params: Upload.ReqDownloadPDF) => {
  return http.get(`${SYS}/uestandardlibrary/download/${params.id}`, undefined, { responseType: "arraybuffer" });
};
