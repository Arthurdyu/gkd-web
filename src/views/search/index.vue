<template>
  <div class="search-contianer">
    <div
      class="intro"
      style="display: flex; gap: 10px; align-items: center; width: 90%; height: auto; padding-top: 20px; margin: 0 auto"
    >
      <p style="flex: 1; min-width: 300px; margin-top: 0; font-size: 20px; color: black" line-height="2.0">
        Serovar, country, and niche entropies of ARGs belonging to distinct classes. <br />

        The ARGs were classed into 12 classes and displayed in different colors. <br />

        The dashed lines indicate 80% of the highest country or serovar entropy value in each ARG class.
      </p>
      <img src="@/assets/images/ARG_Entropy.png" alt="ARG Entropy" style="flex: 2; max-width: 1000px; height: auto" />
    </div>

    <!-- <div class="search" style="margin: 20px 0; text-align: center">
      <h2>ARG Entropy Search</h2>
      <el-input v-model="searchArg" placeholder="Search by ARG" clearable style="width: 300px" @keyup.enter="handleSearch" />
      <el-button type="primary" style="margin-left: 10px" @click="handleSearch"> Search </el-button>
    </div> -->

    <div class="resource-table-arg-all-entropy-container" style="margin: 20px">
      <div class="table-wrapper">
        <ResourceTable
          :table-data="argAllEntropyTableData"
          :columns="argAllEntropyColumnsWithSearch"
          title="| ARG Entropy (270 ARGs)"
          :default-col-min-width="60"
          :default-col-max-width="300"
          :pagination="allPagination"
          :height="460"
          :table-style="{ minWidth: '2000px' }"
          :default-sortable="true"
          :fetch-all-data-function="fetchAllArgAllEntropyData"
          :selected-all-pages-data="allAllEntropySelectedData"
          row-key="id"
          @sort-change="handleAllEntropySortChange"
          @search="handleAllEntropySearch"
          @update:selected-all-pages-data="(data: any[]) => (allAllEntropySelectedData = data)"
        />
      </div>
    </div>

    <div class="resource-table-arg-serovar-entropy-container" style="margin: 20px">
      <div class="table-wrapper">
        <ResourceTable
          :table-data="argSerovarEntropyTableData"
          :columns="argSerovarEntropyColumnsWithSearch"
          title="| ARG Serovar Entropy"
          :default-col-min-width="60"
          :default-col-max-width="300"
          :pagination="serovarPagination"
          :height="500"
          :table-style="{ minWidth: '1000px' }"
          :default-sortable="true"
          :fetch-all-data-function="fetchAllArgSerovarEntropyData"
          :selected-all-pages-data="allSerovarEntropySelectedData"
          row-key="id"
          @sort-change="handleSerovarEntropySortChange"
          @search="handleSerovarSearch"
          @update:selected-all-pages-data="(data: any[]) => (allSerovarEntropySelectedData = data)"
        />
      </div>
    </div>

    <div class="resource-table-arg-country-entropy-container" style="margin: 20px">
      <div class="table-wrapper">
        <ResourceTable
          :table-data="argCountryEntropyTableData"
          :columns="argCountryEntropyColumnsWithSearch"
          title="| ARG Country Entropy"
          :default-col-min-width="60"
          :default-col-max-width="300"
          :pagination="countryPagination"
          :height="450"
          :table-style="{ minWidth: '1000px' }"
          :default-sortable="true"
          :fetch-all-data-function="fetchAllArgCountryEntropyData"
          :selected-all-pages-data="allCountryEntropySelectedData"
          row-key="id"
          @sort-change="handleCountryEntropySortChange"
          @search="handleCountrySearch"
          @update:selected-all-pages-data="(data: any[]) => (allCountryEntropySelectedData = data)"
        />
      </div>
    </div>

    <div class="resource-table-arg-host-entropy-container" style="margin: 20px">
      <div class="table-wrapper">
        <ResourceTable
          :table-data="argHostEntropyTableData"
          :columns="argHostEntropyColumnsWithSearch"
          title="| ARG Host Entropy"
          :default-col-min-width="60"
          :default-col-max-width="300"
          :pagination="hostPagination"
          :height="450"
          :table-style="{ minWidth: '1000px' }"
          :default-sortable="true"
          :fetch-all-data-function="fetchAllArgHostEntropyData"
          :selected-all-pages-data="allHostEntropySelectedData"
          row-key="id"
          @sort-change="handleHostEntropySortChange"
          @search="handleHostSearch"
          @update:selected-all-pages-data="(data: any[]) => (allHostEntropySelectedData = data)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from "vue";
import {
  getArgSerovarEntropyListApi,
  getArgCountryEntropyListApi,
  getArgHostEntropyListApi,
  getArgAllEntropyListApi
} from "@/api/modules/searchpage";
//import { Search } from "@/api/interface/searchpage";
//import { Resource } from "@/api/interface/resourcepage";
import ResourceTable from "@/components/ResourceTable.vue";

// ARG All Entropy 相关代码
//定义表格数据响应式变量
const argAllEntropyTableData = ref<any[]>([]);
const allAllEntropySelectedData: any[] = [];

const argAllEntropyColumns = ref([
  { type: "selection" }, // 添加选择列
  { type: "index", label: "index", width: 65 },
  { prop: "arg", label: "ARG", minWidth: 100, searchable: true },
  { prop: "serovarEntropy", label: "Serovar Entropy", minWidth: 100, sortable: true, searchable: false },
  { prop: "serovarNumber", label: "Serovar Number", minWidth: 100, sortable: true, searchable: false },
  { prop: "totalSerovarNumber", label: "Total Serovar Number", minWidth: 100, sortable: false, searchable: false },
  { prop: "serovarPrevalence", label: "Serovar Prevalence(%)", minWidth: 130, sortable: true, searchable: false },
  { prop: "countryEntropy", label: "Country Entropy", minWidth: 100, sortable: true, searchable: false },
  { prop: "countryNumber", label: "Country Number", minWidth: 100, sortable: true, searchable: false },
  { prop: "totalCountryNumber", label: "Total Country Number", minWidth: 100, sortable: false, searchable: false },
  { prop: "countryPrevalence", label: "Country Prevalence(%)", minWidth: 130, sortable: true, searchable: false },
  { prop: "nicheEntropy", label: "Niche Entropy", minWidth: 100, sortable: true, searchable: false },
  { prop: "nicheNumber", label: "Niche Number", minWidth: 100, sortable: true, searchable: false }
]);

// 搜索过滤器
const allEntropySearchFilters = reactive<Record<string, string>>({});

// 带搜索功能的列定义
const argAllEntropyColumnsWithSearch = computed(() => {
  return argAllEntropyColumns.value.map(col => {
    if (col.searchable) {
      return {
        ...col,
        searchValue: allEntropySearchFilters[col.prop] || ""
      };
    }
    return col;
  });
});

// 监听搜索过滤器变化，触发重新获取数据
// watch(allEntropySearchFilters, () => {
//   allPagination.currentPage = 1;
//   fetchArgAllEntropyData();
// }, { deep: true });

const allPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  pageSizes: [10, 20, 50],
  onSizeChange: (val: number) => {
    allPagination.pageSize = val;
    fetchArgAllEntropyData();
  },
  onCurrentChange: (val: number) => {
    console.log("allPagination onCurrentChange:", val); // 调试日志
    allPagination.currentPage = val;
    fetchArgAllEntropyData();
  }
});

// 排序参数
const allEntropySortParams = reactive({
  sidx: "",
  order: ""
});

const handleAllEntropySortChange = (sortInfo: { column: any; prop: string; order: string }) => {
  if (sortInfo.order) {
    allEntropySortParams.sidx = sortInfo.prop;
    allEntropySortParams.order = sortInfo.order === "ascending" ? "asc" : "desc";
  } else {
    allEntropySortParams.sidx = "";
    allEntropySortParams.order = "";
  }
  fetchArgAllEntropyData();
};

// 搜索防抖定时器
const searchDebounceTimers = ref<{ [key: string]: NodeJS.Timeout }>({});

const handleAllEntropySearch = (prop: string, value?: string) => {
  // 清除之前的定时器
  if (searchDebounceTimers.value[prop]) {
    clearTimeout(searchDebounceTimers.value[prop]);
  }

  // 设置新的防抖定时器
  searchDebounceTimers.value[prop] = setTimeout(() => {
    // 如果提供了value参数，则直接使用它更新搜索过滤器
    if (value !== undefined) {
      console.log("Received search value from input event:", prop, value);
      allEntropySearchFilters[prop] = value;
    } else {
      // 否则，从ResourceTable组件获取搜索值并更新过滤器
      const column = argAllEntropyColumnsWithSearch.value.find(col => col.prop === prop && col.searchable);
      if (column && column.searchable && typeof (column as any).searchValue === "string") {
        console.log("Retrieved search value from column config:", prop, (column as any).searchValue);
        allEntropySearchFilters[prop] = (column as any).searchValue;
      }
    }

    console.log("Updated allEntropySearchFilters:", { ...allEntropySearchFilters });

    // 重置分页到第一页
    allPagination.currentPage = 1;

    // 触发数据重新获取
    fetchArgAllEntropyData();
  }, 300); // 300ms 防抖延迟
};

const fetchArgAllEntropyData = async () => {
  try {
    console.log("Fetching argAllEntropyData with page:", allPagination.currentPage); // 调试日志
    const params: any = {
      curPage: allPagination.currentPage,
      limit: allPagination.pageSize,
      sidx: allEntropySortParams.sidx,
      order: allEntropySortParams.order
    };

    // 添加列搜索条件
    Object.keys(allEntropySearchFilters).forEach(key => {
      if (allEntropySearchFilters[key]) {
        params[key] = allEntropySearchFilters[key];
      }
    });

    console.log("All Entropy API request params:", { ...params });

    const res: any = await getArgAllEntropyListApi(params);

    // 字段名映射
    const transformItem = (item: any) => {
      return {
        id: item.arg, // 使用arg作为唯一标识符
        arg: item.arg,
        serovarEntropy: item.serovarEntropy,
        serovarNumber: item.serovarNumber,
        totalSerovarNumber: item.totalSerovarNumber,
        serovarPrevalence: item.serovarPrevalence,
        countryEntropy: item.countryEntropy,
        countryNumber: item.countryNumber,
        totalCountryNumber: item.totalCountryNumber,
        countryPrevalence: item.countryPrevalence,
        nicheEntropy: item.nicheEntropy,
        nicheNumber: item.nicheNumber
      };
    };

    if (res && res.data) {
      argAllEntropyTableData.value = (res.data.list || []).map(transformItem);
      allPagination.total = res.data.totalCount || 0;
      console.log("argAllEntropy数据列表:", res);
    } else {
      argAllEntropyTableData.value = [];
      allPagination.total = 0;
    }
  } catch (error) {
    console.error("获取argAllEntropy数据失败:", error);
    argAllEntropyTableData.value = [];
    allPagination.total = 0;
  }
};

// 获取所有ARG All Entropy数据（用于导出）
const fetchAllArgAllEntropyData = async (extraParams = {}) => {
  try {
    const params: any = {
      curPage: 1,
      limit: 10000, // 设置一个足够大的数字以获取所有数据
      sidx: allEntropySortParams.sidx,
      order: allEntropySortParams.order,
      ...extraParams
    };

    // 添加列搜索条件
    Object.keys(allEntropySearchFilters).forEach(key => {
      if (allEntropySearchFilters[key]) {
        params[key] = allEntropySearchFilters[key];
      }
    });

    console.log("All Entropy API request params:", { ...params });

    const res: any = await getArgAllEntropyListApi(params, { export: true });

    // 字段名映射
    const transformItem = (item: any) => {
      return {
        id: item.arg, // 使用arg作为唯一标识符
        arg: item.arg,
        serovarEntropy: item.serovarEntropy,
        serovarNumber: item.serovarNumber,
        totalSerovarNumber: item.totalSerovarNumber,
        serovarPrevalence: item.serovarPrevalence,
        countryEntropy: item.countryEntropy,
        countryNumber: item.countryNumber,
        totalCountryNumber: item.totalCountryNumber,
        countryPrevalence: item.countryPrevalence,
        nicheEntropy: item.nicheEntropy,
        nicheNumber: item.nicheNumber
      };
    };

    if (res && res.data) {
      return (res.data.list || []).map(transformItem);
    }
    return [];
  } catch (error) {
    console.error("获取所有argAllEntropy数据失败:", error);
    throw error;
  }
};

//定义ARG Serovar Entropy表格数据响应式变量
const argSerovarEntropyTableData = ref<any[]>([]);
const allSerovarEntropySelectedData: any[] = [];

const argSerovarEntropyColumns = ref([
  { type: "selection" }, // 添加选择列
  { type: "index", label: "index", width: 65 },
  { prop: "arg", label: "ARG", minWidth: 100, searchable: true },
  { prop: "serovar", label: "Serovar", minWidth: 100, searchable: true },
  {
    prop: "genomeNumberOfSerovarCarryingTheARG",
    label: "Genome Number Of Serovar Carrying The ARG",
    minWidth: 200,
    sortable: true,
    searchable: false
  },
  {
    prop: "totalGenomeNumberOfTheSerovar",
    label: "Total Genome Number Of The Serovar",
    minWidth: 200,
    sortable: true,
    searchable: false
  },
  { prop: "percent", label: "percent (%)", minWidth: 100, sortable: true, searchable: false },
  { prop: "serovarEntropy", label: "Serovar Entropy", minWidth: 100, sortable: true, searchable: false }
]);

// 带搜索功能的列定义
const argSerovarEntropyColumnsWithSearch = computed(() => {
  return argSerovarEntropyColumns.value.map(col => {
    if (col.searchable) {
      return {
        ...col,
        searchValue: serovarSearchFilters[col.prop] || ""
      };
    }
    return col;
  });
});

// 监听搜索过滤器变化，触发重新获取数据
// watch(serovarSearchFilters, () => {
//   serovarPagination.currentPage = 1;
//   fetchArgSerovarEntropyData();
// }, { deep: true });

// 搜索过滤器
const serovarSearchFilters = reactive<Record<string, string>>({});

// 分页配置
const serovarPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  pageSizes: [10, 20, 50],
  onSizeChange: (val: number) => {
    console.log("serovarPagination onSizeChange:", val); // 调试日志
    serovarPagination.pageSize = val;
    fetchArgSerovarEntropyData();
  },
  onCurrentChange: (val: number) => {
    console.log("serovarPagination onCurrentChange:", val); // 调试日志
    serovarPagination.currentPage = val;
    fetchArgSerovarEntropyData();
  }
});

// 排序参数
const serovarEntropySortParams = reactive({
  sidx: "",
  order: ""
});

const handleSerovarEntropySortChange = (sortInfo: { column: any; prop: string; order: string }) => {
  if (sortInfo.order) {
    serovarEntropySortParams.sidx = sortInfo.prop;
    serovarEntropySortParams.order = sortInfo.order === "ascending" ? "asc" : "desc";
  } else {
    serovarEntropySortParams.sidx = "";
    serovarEntropySortParams.order = "";
  }
  fetchArgSerovarEntropyData();
};

//处理搜索（带防抖）
const handleSerovarSearch = (prop: string, value?: string) => {
  // 清除之前的定时器
  if (searchDebounceTimers.value[prop]) {
    clearTimeout(searchDebounceTimers.value[prop]);
  }

  // 设置新的防抖定时器
  searchDebounceTimers.value[prop] = setTimeout(() => {
    // 如果提供了value参数，则直接使用它更新搜索过滤器
    if (value !== undefined) {
      console.log("Received search value from input event:", prop, value);
      serovarSearchFilters[prop] = value;
    } else {
      // 否则，从ResourceTable组件获取搜索值并更新过滤器
      const column = argSerovarEntropyColumnsWithSearch.value.find(col => col.prop === prop && col.searchable);
      if (column && column.searchable && typeof (column as any).searchValue === "string") {
        console.log("Retrieved search value from column config:", prop, (column as any).searchValue);
        serovarSearchFilters[prop] = (column as any).searchValue;
      }
    }

    console.log("Updated serovarSearchFilters:", { ...serovarSearchFilters });

    // 重置分页到第一页
    serovarPagination.currentPage = 1;

    // 触发数据重新获取
    fetchArgSerovarEntropyData();
  }, 300); // 300ms 防抖延迟
};

//过滤
const searchArg = ref<string>("");
const searchSerovar = ref<string>("");
// 获取ARG Serovar Entropy表格数据函数
const fetchArgSerovarEntropyData = async () => {
  try {
    console.log("Fetching argSerovarEntropyData with page:", serovarPagination.currentPage); // 调试日志
    const params: any = {
      curPage: serovarPagination.currentPage,
      limit: serovarPagination.pageSize,
      sidx: serovarEntropySortParams.sidx,
      order: serovarEntropySortParams.order
    };
    //搜索条件
    if (searchArg.value) params.arg = searchArg.value;
    if (searchSerovar.value) params.serovar = searchSerovar.value;

    // 添加列搜索条件
    Object.keys(serovarSearchFilters).forEach(key => {
      if (serovarSearchFilters[key]) {
        params[key] = serovarSearchFilters[key];
      }
    });

    console.log("Serovar Entropy API request params:", { ...params });

    const res: any = await getArgSerovarEntropyListApi(params);
    // 字段名映射
    const transformItem = (item: any) => {
      return {
        id: `${item.arg}-${item.serovar}`, // 使用arg和serovar组合作为唯一标识符
        arg: item.arg,
        serovar: item.serovar,
        genomeNumberOfSerovarCarryingTheARG: item.genomeNumberOfSerovarCarryingTheARG,
        totalGenomeNumberOfTheSerovar: item.totalGenomeNumberOfTheSerovar,
        percent: item.percent,
        serovarEntropy: item.serovarEntropy
      };
    };

    // 根据实际返回的数据结构调整访问路径
    if (res && res.data) {
      // 转换数据格式以适配前端组件
      argSerovarEntropyTableData.value = (res.data.list || []).map(transformItem);
      serovarPagination.total = res.data.totalCount || 0;
      console.log("argSerovarEntropy数据列表:", res);
    } else {
      argSerovarEntropyTableData.value = [];
      serovarPagination.total = 0;
    }
  } catch (error) {
    console.error("获取argSerovarEntropy数据失败:", error);
    argSerovarEntropyTableData.value = [];
    serovarPagination.total = 0;
  }
};

// 获取所有ARG Serovar Entropy数据（用于导出）
const fetchAllArgSerovarEntropyData = async (extraParams = {}) => {
  try {
    const params: any = {
      curPage: 1,
      limit: 10000, // 设置一个足够大的数字以获取所有数据
      sidx: serovarEntropySortParams.sidx,
      order: serovarEntropySortParams.order,
      ...extraParams
    };
    //搜索条件
    if (searchArg.value) params.arg = searchArg.value;
    if (searchSerovar.value) params.serovar = searchSerovar.value;

    // 添加列搜索条件
    Object.keys(serovarSearchFilters).forEach(key => {
      if (serovarSearchFilters[key]) {
        params[key] = serovarSearchFilters[key];
      }
    });

    const res: any = await getArgSerovarEntropyListApi(params, { export: true });
    // 字段名映射
    const transformItem = (item: any) => {
      return {
        id: `${item.arg}-${item.serovar}`, // 使用arg和serovar组合作为唯一标识符
        arg: item.arg,
        serovar: item.serovar,
        genomeNumberOfSerovarCarryingTheARG: item.genomeNumberOfSerovarCarryingTheARG,
        totalGenomeNumberOfTheSerovar: item.totalGenomeNumberOfTheSerovar,
        percent: item.percent,
        serovarEntropy: item.serovarEntropy
      };
    };

    // 根据实际返回的数据结构调整访问路径
    if (res && res.data) {
      // 转换数据格式以适配前端组件
      return (res.data.list || []).map(transformItem);
    }
    return [];
  } catch (error) {
    console.error("获取所有argSerovarEntropy数据失败:", error);
    throw error;
  }
};

// ARG Country Entropy 相关代码
const argCountryEntropyTableData = ref<any[]>([]);
const allCountryEntropySelectedData: any[] = [];

const argCountryEntropyColumns = ref([
  { type: "selection" }, // 添加选择列
  { type: "index", label: "index", width: 65 },
  { prop: "arg", label: "ARG", minWidth: 100, searchable: true },
  { prop: "country", label: "Country", minWidth: 100, searchable: true },
  {
    prop: "genomeNumberOfCountryCarryingTheARG",
    label: "Genome Number Of Country Carrying The ARG",
    minWidth: 200,
    sortable: true,
    searchable: false
  },
  {
    prop: "totalGenomeNumberOfTheCountry",
    label: "Total Genome Number Of Country",
    minWidth: 200,
    sortable: true,
    searchable: false
  },
  { prop: "percent", label: "percent (%)", minWidth: 100, sortable: true, searchable: false },
  { prop: "countryEntropy", label: "Country Entropy", minWidth: 100, sortable: true, searchable: false }
]);

// 带搜索功能的列定义
const argCountryEntropyColumnsWithSearch = computed(() => {
  return argCountryEntropyColumns.value.map(col => {
    if (col.searchable) {
      return {
        ...col,
        searchValue: countrySearchFilters[col.prop] || ""
      };
    }
    return col;
  });
});

// 监听搜索过滤器变化，触发重新获取数据
// watch(countrySearchFilters, () => {
//   countryPagination.currentPage = 1;
//   fetchArgCountryEntropyData();
// }, { deep: true });

// 搜索过滤器
const countrySearchFilters = reactive<Record<string, string>>({});

const countryPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  pageSizes: [10, 20, 50],
  onSizeChange: (val: number) => {
    console.log("countryPagination onSizeChange:", val); // 调试日志
    countryPagination.pageSize = val;
    fetchArgCountryEntropyData();
  },
  onCurrentChange: (val: number) => {
    console.log("countryPagination onCurrentChange:", val); // 调试日志
    countryPagination.currentPage = val;
    fetchArgCountryEntropyData();
  }
});

// 排序参数
const countryEntropySortParams = reactive({
  sidx: "",
  order: ""
});

const handleCountryEntropySortChange = (sortInfo: { column: any; prop: string; order: string }) => {
  if (sortInfo.order) {
    countryEntropySortParams.sidx = sortInfo.prop;
    countryEntropySortParams.order = sortInfo.order === "ascending" ? "asc" : "desc";
  } else {
    countryEntropySortParams.sidx = "";
    countryEntropySortParams.order = "";
  }
  fetchArgCountryEntropyData();
};

const handleCountrySearch = (prop: string, value?: string) => {
  // 清除之前的定时器
  if (searchDebounceTimers.value[prop]) {
    clearTimeout(searchDebounceTimers.value[prop]);
  }

  // 设置新的防抖定时器
  searchDebounceTimers.value[prop] = setTimeout(() => {
    // 如果提供了value参数，则直接使用它更新搜索过滤器
    if (value !== undefined) {
      console.log("Received search value from input event:", prop, value);
      countrySearchFilters[prop] = value;
    } else {
      // 否则，从ResourceTable组件获取搜索值并更新过滤器
      const column = argCountryEntropyColumnsWithSearch.value.find(col => col.prop === prop && col.searchable);
      if (column && column.searchable && typeof (column as any).searchValue === "string") {
        console.log("Retrieved search value from column config:", prop, (column as any).searchValue);
        countrySearchFilters[prop] = (column as any).searchValue;
      }
    }

    console.log("Updated countrySearchFilters:", { ...countrySearchFilters });

    // 重置分页到第一页
    countryPagination.currentPage = 1;

    // 触发数据重新获取
    fetchArgCountryEntropyData();
  }, 300); // 300ms 防抖延迟
};

const searchCountryArg = ref<string>("");
const searchCountry = ref<string>("");

const fetchArgCountryEntropyData = async () => {
  try {
    console.log("Fetching argCountryEntropyData with page:", countryPagination.currentPage); // 调试日志
    const params: any = {
      curPage: countryPagination.currentPage,
      limit: countryPagination.pageSize,
      sidx: countryEntropySortParams.sidx,
      order: countryEntropySortParams.order
    };

    // 搜索条件
    if (searchCountryArg.value) params.arg = searchCountryArg.value;
    if (searchCountry.value) params.country = searchCountry.value;

    // 添加列搜索条件
    Object.keys(countrySearchFilters).forEach(key => {
      if (countrySearchFilters[key]) {
        params[key] = countrySearchFilters[key];
      }
    });

    console.log("Country Entropy API request params:", { ...params });

    const res: any = await getArgCountryEntropyListApi(params);

    // 字段名映射
    const transformItem = (item: any) => {
      return {
        id: `${item.arg}-${item.country}`, // 使用arg和country组合作为唯一标识符
        arg: item.arg,
        country: item.country,
        genomeNumberOfCountryCarryingTheARG: item.genomeNumberOfCountryCarryingTheARG,
        totalGenomeNumberOfTheCountry: item.totalGenomeNumberOfTheCountry,
        percent: item.percent,
        countryEntropy: item.countryEntropy
      };
    };

    if (res && res.data) {
      argCountryEntropyTableData.value = (res.data.list || []).map(transformItem);
      countryPagination.total = res.data.totalCount || 0;
      console.log("argCountryEntropy数据列表:", res);
    } else {
      argCountryEntropyTableData.value = [];
      countryPagination.total = 0;
    }
  } catch (error) {
    console.error("获取argCountryEntropy数据失败:", error);
    argCountryEntropyTableData.value = [];
    countryPagination.total = 0;
  }
};

// 获取所有ARG Country Entropy数据（用于导出）
const fetchAllArgCountryEntropyData = async (extraParams = {}) => {
  try {
    const params: any = {
      curPage: 1,
      limit: 10000, // 设置一个足够大的数字以获取所有数据
      sidx: countryEntropySortParams.sidx,
      order: countryEntropySortParams.order,
      ...extraParams
    };

    // 搜索条件
    if (searchCountryArg.value) params.arg = searchCountryArg.value;
    if (searchCountry.value) params.country = searchCountry.value;

    // 添加列搜索条件
    Object.keys(countrySearchFilters).forEach(key => {
      if (countrySearchFilters[key]) {
        params[key] = countrySearchFilters[key];
      }
    });

    const res: any = await getArgCountryEntropyListApi(params, { export: true });

    // 字段名映射
    const transformItem = (item: any) => {
      return {
        id: `${item.arg}-${item.country}`, // 使用arg和country组合作为唯一标识符
        arg: item.arg,
        country: item.country,
        genomeNumberOfCountryCarryingTheARG: item.genomeNumberOfCountryCarryingTheARG,
        totalGenomeNumberOfTheCountry: item.totalGenomeNumberOfTheCountry,
        percent: item.percent,
        countryEntropy: item.countryEntropy
      };
    };

    if (res && res.data) {
      return (res.data.list || []).map(transformItem);
    }
    return [];
  } catch (error) {
    console.error("获取所有argCountryEntropy数据失败:", error);
    throw error;
  }
};

// ARG Host Entropy 相关代码
const argHostEntropyTableData = ref<any[]>([]);
const allHostEntropySelectedData: any[] = [];

const argHostEntropyColumns = ref([
  { type: "selection" }, // 添加选择列
  { type: "index", label: "index", width: 65 },
  { prop: "arg", label: "ARG", minWidth: 100, searchable: true },
  { prop: "host", label: "Host", minWidth: 100, searchable: true },
  {
    prop: "genomeNumberOfHostCarryingTheARG",
    label: "Genome Number Of Host Carrying The ARG",
    minWidth: 200,
    sortable: true,
    searchable: false
  },
  {
    prop: "totalGenomeNumberOfTheHost",
    label: "Total Genome Number Of Host",
    minWidth: 200,
    sortable: true,
    searchable: false
  },
  { prop: "percent", label: "percent (%)", minWidth: 100, sortable: true, searchable: false },
  { prop: "hostEntropy", label: "Host Entropy", minWidth: 100, sortable: true, searchable: false }
]);

// 带搜索功能的列定义
const argHostEntropyColumnsWithSearch = computed(() => {
  return argHostEntropyColumns.value.map(col => {
    if (col.searchable) {
      return {
        ...col,
        searchValue: hostSearchFilters[col.prop] || ""
      };
    }
    return col;
  });
});

// 监听搜索过滤器变化，触发重新获取数据
// watch(hostSearchFilters, () => {
//   hostPagination.currentPage = 1;
//   fetchArgHostEntropyData();
// }, { deep: true });

// 搜索过滤器
const hostSearchFilters = reactive<Record<string, string>>({});

const hostPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  pageSizes: [10, 20, 50],
  onSizeChange: (val: number) => {
    console.log("hostPagination onSizeChange:", val); // 调试日志
    hostPagination.pageSize = val;
    fetchArgHostEntropyData();
  },
  onCurrentChange: (val: number) => {
    console.log("hostPagination onCurrentChange:", val); // 调试日志
    hostPagination.currentPage = val;
    fetchArgHostEntropyData();
  }
});

// 排序参数
const hostEntropySortParams = reactive({
  sidx: "",
  order: ""
});

const handleHostEntropySortChange = (sortInfo: { column: any; prop: string; order: string }) => {
  if (sortInfo.order) {
    hostEntropySortParams.sidx = sortInfo.prop;
    hostEntropySortParams.order = sortInfo.order === "ascending" ? "asc" : "desc";
  } else {
    hostEntropySortParams.sidx = "";
    hostEntropySortParams.order = "";
  }
  fetchArgHostEntropyData();
};

const handleHostSearch = (prop: string, value?: string) => {
  // 清除之前的定时器
  if (searchDebounceTimers.value[prop]) {
    clearTimeout(searchDebounceTimers.value[prop]);
  }

  // 设置新的防抖定时器
  searchDebounceTimers.value[prop] = setTimeout(() => {
    // 如果提供了value参数，则直接使用它更新搜索过滤器
    if (value !== undefined) {
      console.log("Received search value from input event:", prop, value);
      hostSearchFilters[prop] = value;
    } else {
      // 否则，从ResourceTable组件获取搜索值并更新过滤器
      const column = argHostEntropyColumnsWithSearch.value.find(col => col.prop === prop && col.searchable);
      if (column && column.searchable && typeof (column as any).searchValue === "string") {
        console.log("Retrieved search value from column config:", prop, (column as any).searchValue);
        hostSearchFilters[prop] = (column as any).searchValue;
      }
    }

    console.log("Updated hostSearchFilters:", { ...hostSearchFilters });

    // 重置分页到第一页
    hostPagination.currentPage = 1;

    // 触发数据重新获取
    fetchArgHostEntropyData();
  }, 300); // 300ms 防抖延迟
};

const searchHostArg = ref<string>("");
const searchHost = ref<string>("");

const fetchArgHostEntropyData = async () => {
  try {
    console.log("Fetching argHostEntropyData with page:", hostPagination.currentPage); // 调试日志
    const params: any = {
      curPage: hostPagination.currentPage,
      limit: hostPagination.pageSize,
      sidx: hostEntropySortParams.sidx,
      order: hostEntropySortParams.order
    };

    // 搜索条件
    if (searchHostArg.value) params.arg = searchHostArg.value;
    if (searchHost.value) params.host = searchHost.value;

    // 添加列搜索条件
    Object.keys(hostSearchFilters).forEach(key => {
      if (hostSearchFilters[key]) {
        params[key] = hostSearchFilters[key];
      }
    });

    console.log("Host Entropy API request params:", { ...params });

    const res: any = await getArgHostEntropyListApi(params);

    // 字段名映射
    const transformItem = (item: any) => {
      return {
        id: `${item.arg}-${item.host}`, // 使用arg和host组合作为唯一标识符
        arg: item.arg,
        host: item.host,
        genomeNumberOfHostCarryingTheARG: item.genomeNumberOfHostCarryingTheARG,
        totalGenomeNumberOfTheHost: item.totalGenomeNumberOfTheHost,
        percent: item.percent,
        hostEntropy: item.hostEntropy
      };
    };

    if (res && res.data) {
      argHostEntropyTableData.value = (res.data.list || []).map(transformItem);
      hostPagination.total = res.data.totalCount || 0;
      console.log("argHostEntropy数据列表:", res);
    } else {
      argHostEntropyTableData.value = [];
      hostPagination.total = 0;
    }
  } catch (error) {
    console.error("获取argHostEntropy数据失败:", error);
    argHostEntropyTableData.value = [];
    hostPagination.total = 0;
  }
};

// 获取所有ARG Host Entropy数据（用于导出）
const fetchAllArgHostEntropyData = async (extraParams = {}) => {
  try {
    const params: any = {
      curPage: 1,
      limit: 10000, // 设置一个足够大的数字以获取所有数据
      sidx: hostEntropySortParams.sidx,
      order: hostEntropySortParams.order,
      ...extraParams
    };

    // 搜索条件
    if (searchHostArg.value) params.arg = searchHostArg.value;
    if (searchHost.value) params.host = searchHost.value;

    // 添加列搜索条件
    Object.keys(hostSearchFilters).forEach(key => {
      if (hostSearchFilters[key]) {
        params[key] = hostSearchFilters[key];
      }
    });

    const res: any = await getArgHostEntropyListApi(params, { export: true });

    // 字段名映射
    const transformItem = (item: any) => {
      return {
        id: `${item.arg}-${item.host}`, // 使用arg和host组合作为唯一标识符
        arg: item.arg,
        host: item.host,
        genomeNumberOfHostCarryingTheARG: item.genomeNumberOfHostCarryingTheARG,
        totalGenomeNumberOfTheHost: item.totalGenomeNumberOfTheHost,
        percent: item.percent,
        hostEntropy: item.hostEntropy
      };
    };

    if (res && res.data) {
      return (res.data.list || []).map(transformItem);
    }
    return [];
  } catch (error) {
    console.error("获取所有argHostEntropy数据失败:", error);
    throw error;
  }
};

// const handleSearch = () => {
//   fetchArgSerovarEntropyData();
//   fetchArgCountryEntropyData();
//   fetchArgHostEntropyData();
//   fetchArgAllEntropyData();
// };

// 监听搜索过滤器变化
// const watchSearchFilters = () => {
//   // 监听 serovarSearchFilters 变化
//   Object.keys(serovarSearchFilters).forEach(key => {
//     // 使用计算属性和 watch 来监听变化
//   });
// };

onMounted(() => {
  fetchArgSerovarEntropyData();
  fetchArgCountryEntropyData();
  fetchArgHostEntropyData();
  fetchArgAllEntropyData();
});

// onUnmounted(() => {
//   // 清理所有防抖定时器
//   Object.values(searchDebounceTimers.value).forEach(timer => {
//     if (timer) clearTimeout(timer);
//   });
// });
</script>

<style scoped lang="scss">
@import "./index";
</style>
