export declare namespace Search {
  // ARG 熵值表格数据请求参数
  interface ReqArgSerovarEntropyList {
    curPage: number;
    limit: number;
    export?: boolean;
  }
  // ARG 熵值表格数据响应
  interface ResArgSerovarEntropyList {
    currPage: number;
    list: ResArgSerovarEntropyItem[];
    pageSize: number;
    totalCount: number;
    totalPage: number;
  }
  // ARG 熵值表格Item数据
  interface ResArgSerovarEntropyItem {
    arg: string; // ARG
    serovar: string; // Serovar
    genomeNumberOfSerovarCarringTheArg: number; // Genome Number of Serovar Carrying ARG
    totalGenomeNumberOfSerovar: number; // Total Genome Number of Serovar
    percent: number; // Prevalence(%)
    SerovarEntropy: number; // ARG Serovar Entropy
  }

  // 分开的熵值表格数据请求参数
  interface ReqArgCountryEntropyList {
    curPage: number;
    limit: number;
    export?: boolean;
  }
  interface ResArgCountryEntropyList {
    currPage: number;
    list: ResArgSerovarEntropyItem[];
    pageSize: number;
    totalCount: number;
    totalPage: number;
  }
  interface ResArgCountryEntropyItem {
    arg: string; // ARG
    country: string; // Country
    genomeNumberOfCountryCarringTheArg: number; // Genome Number of Country Carrying ARG
    totalGenomeNumberOfCountry: number; // Total Genome Number of Country
    percent: number; // Prevalence(%)
    countryEntropy: number; // Country Entropy
  }

  interface ReqArgHostEntropyList {
    curPage: number;
    limit: number;
    export?: boolean;
  }
  interface ResArgHostEntropyList {
    currPage: number;
    list: ResArgHostEntropyItem[];
    pageSize: number;
    totalCount: number;
    totalPage: number;
  }
  interface ResArgHostEntropyItem {
    arg: string; // ARG
    host: string; // Host
    genomeNumberOfHostCarringTheArg: number; // Genome Number of Host Carrying ARG
    totalGenomeNumberOfHost: number; // Total Genome Number of Host
    percent: number; // Prevalence(%)
    hostEntropy: number; // Host Entropy
  }

  // 通用API响应类型
  interface ApiResponse<T> {
    code: string;
    data: T;
    msg: string;
  }
}
