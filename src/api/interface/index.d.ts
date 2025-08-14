type UpperLetter =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";

type UnderlineChar<Str extends string> = Str extends UpperLetter ? `_${Lowercase<Str>}` : Str;

type UnderlineCase<Str extends string> = Str extends `${infer First}${infer Upper}${infer Rest}`
  ? `${UnderlineChar<First>}${UnderlineChar<Upper>}${UnderlineCase<Rest>}`
  : Str;

// 请求响应参数（不包含data）
interface Result {
  code: string;
  msg: string;
}

// 请求响应参数（包含data）
interface ResultData<T = any> extends Result {
  data: T;
}

// 分页响应参数
interface ResPage<T> {
  list: T[];
  total: number;
}

type Optional<T> = { [P in keyof T]?: T[P] };
// 分页请求参数
type ReqPage<T> = Optional<T> & {
  page: number;
  limit: number;
  orderField?: UnderlineCase<Exclude<keyof T, "id">>;
  order?: "asc" | "desc";
};

// 文件上传模块
declare namespace Upload {
  interface ResFileUrl {
    url: string;
    size: number;
  }
  type ReqPDF = {
    id: string;
  };
  type ResPDF = string;
  type ReqDownloadPDF = {
    id: string;
  };
}
