export declare namespace Resource {
  //worldmap 数据请求
  interface ReqWorldmap {
    [country: string]: number;
  }
  interface ResWorldmap {
    total: number;
    list: ResWorldmapItem[];
  }
  interface ResWorldmapItem {
    country: string;
    number: number;
  }

  //宿主数据
  interface ResHost {
    total: number;
    list: ResHostItem[];
  }
  interface ResHostItem {
    host: string;
    number: number;
  }

  //每年测序的基因组
  interface SequenceYearItem {
    year: number;
    number: number;
  }
  interface ResSequenceYear {
    total: number;
    list: ResYearlyGenomeItem[];
  }

  //血清型的数量、饼图
  interface ResSerovar {
    total: number;
    list: ResSerovarItem[];
  }
  interface ResSerovarItem {
    serovar: string;
    number: number;
  }

  //ST型数量、饼图
  interface ResST {
    total: number;
    list: ResSTItem[];
  }
  interface ResSTItem {
    st: string;
    number: number;
  }

  // sankey 数据
  interface ResSankey {
    //total: number;
    list: ResSankeyItem[];
  }

  interface ResSankeyItem {
    serovar: string; // 来源节点
    st: string; // 目标节点
    number: number; // 流量值
  }

  // Meta 表格数据请求参数
  interface ReqMetaList {
    curPage: number;
    limit: number;
  }
  // Meta 表格数据响应
  interface ResMetaList {
    currPage: number;
    list: ResMetaItem[];
    pageSize: number;
    totalCount: number;
    totalPage: number;
  }
  // Meta 表格Item数据请求参数
  interface ReqMetaIem {
    strain?: string;
    subspecies?: null | string;
    serovar?: null | string;
    st?: null | string;
    isolationSource?: null | string;
    host?: null | string;
    collectionYear?: null | string;
    country?: null | string;
    oneHealth?: null | string;
    onehealth2?: null | string;
    oneHealth3?: null | string;
    argNumber?: null | string;
    vfNumber?: null | string;
    invasive?: null | string;
    argList?: null | string;
    plasmidNumber?: null | string;
    plasmidList?: null | string;
    vfList?: null | string;
  }
  // Meta Res表格Item数据
  interface ResMetaItem {
    strain?: string;
    subspecies?: null | string;
    serovar?: null | string;
    st?: null | string;
    isolationSource?: null | string;
    host?: null | string;
    collectionYear?: null | string;
    country?: null | string;
    oneHealth?: null | string;
    onehealth2?: null | string;
    oneHealth3?: null | string;
    argNumber?: null | string;
    vfNumber?: null | string;
    invasive?: null | string;
    argList?: null | string;
    plasmidNumber?: null | string;
    plasmidList?: null | string;
    vfList?: null | string;
  }

  // request 请求参数类型
  interface ReqSequenceYear {
    year?: string; // 年份
    sequences_per_year?: number; // 每年分离量
  }

  // response 响应数据类型
  interface ResSequenceYear {
    year: string; // 年份
    sequences_per_year: number; // 每年分离量
  }

  // ARG 熵值表格数据请求参数
  interface ReqArgEntropyCountList {
    curPage: number;
    limit: number;
  }
  // ARG 熵值表格数据响应
  interface ResArgEntropyCountList {
    currPage: number;
    list: ResArgEntropyCountItem[];
    pageSize: number;
    totalCount: number;
    totalPage: number;
  }
  // ARG 熵值表格Item数据
  interface ResArgEntropyCountItem {
    arg: string; // ARG
    argSerovarEntropy: number; // ARG Serovar Entropy
    serovarNumber: number; // Serovar Number
    totalSerovarNumber: number; // Total Serovar Number
    serovarPrevalence: number; // Prevalence(%)
    countryEntropy: number; // Country Entropy
    countryNumber: number; // Country Number
    totalCountryNumber: number; // Total Country Number
    countryPrevalence: number; // Prevalence(%)
    nicheEntropy: number; // Niche Entropy
    nicheNumber: number; // Niche Number
  }

  // 通用API响应类型
  interface ApiResponse<T> {
    code: string;
    data: T;
    msg: string;
  }
}
