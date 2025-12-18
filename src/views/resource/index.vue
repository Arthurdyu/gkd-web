<template>
  <div class="resource-container">
    <div class="map-filter">
      <div class="filter-bar">
        <!-- 血清型筛选 -->
        <div class="filter-item" style="margin-left: 20px">
          <label>{{ $t("resource.serovar") }}:</label>
          <el-select
            v-model="mapFilters.serovar"
            multiple
            clearable
            filterable
            allow-create
            collapse-tags
            :placeholder="$t('resource.select_serovar')"
            popper-class="custom-header"
            :max-collapse-tags="1"
            style="width: 200px"
          >
            <template #header>
              <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll"> All </el-checkbox>
            </template>
            <el-option v-for="item in serovarOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>

        <!-- 宿主筛选 -->
        <div class="filter-item">
          <label>{{ $t("resource.host") }}:</label>
          <el-select
            v-model="mapFilters.host"
            multiple
            clearable
            filterable
            allow-create
            collapse-tags
            :placeholder="$t('resource.select_host')"
            popper-class="custom-header"
            :max-collapse-tags="1"
            style="width: 200px"
          >
            <template #header>
              <el-checkbox v-model="hostCheckAll" :indeterminate="hostIndeterminate" @change="handleHostCheckAll">
                All
              </el-checkbox>
            </template>
            <el-option v-for="item in hostOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <!-- 调试信息 -->
          <!-- <div style="margin-left: 10px; font-size: 12px; color: #999999">选项数: {{ hostOptions.length }}</div> -->
        </div>
        <!-- 生境筛选 -->
        <div class="filter-item">
          <label>{{ $t("resource.oneHealth") }}:</label>
          <el-select
            v-model="mapFilters.onehealth"
            multiple
            clearable
            filterable
            collapse-tags
            :placeholder="$t('resource.select_oneHealth')"
            popper-class="custom-header"
            :max-collapse-tags="1"
            style="width: 200px"
          >
            <template #header>
              <el-checkbox v-model="oneHealthCheckAll" :indeterminate="oneHealthIndeterminate" @change="handleOneHealthCheckAll">
                All
              </el-checkbox>
            </template>
            <el-option v-for="item in oneHealthOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <!-- 调试信息 -->
          <!-- <div style="margin-left: 10px; font-size: 12px; color: #999999">选项数: {{ oneHealthOptions.length }}</div> -->
        </div>

        <!-- 年份区间筛选 -->
        <!-- <div class="filter-item">
          <label>年份区间:</label>
          <el-date-picker
            v-model="mapFilters.yearRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始年份"
            end-placeholder="结束年份"
            format="YYYY"
            value-format="YYYY"
            style="width: 240px"
          />
        </div> -->

        <!-- 重置按钮 -->
        <div class="filter-item">
          <el-button type="primary" @click="getWorldmapData">{{ $t("resource.map_filter") }}</el-button>
          <el-button @click="resetMapFilters">{{ $t("resource.map_filter_reset") }}</el-button>
        </div>
      </div>
    </div>
    <div class="resource-map">
      <div class="map-container">
        <!-- <MapECharts :option="worldMapOption" width="800px" height="400px" /> -->
        <MapECharts class="mapEcharts" :map-data="mapData" />
        <div class="top-countries">
          <div v-for="(country, index) in topCountries" :key="index" class="country-item">
            <span class="country-name">{{ country.name }}</span>
            <div class="bar" :style="{ width: getBarWidth(country.value) }"></div>
            <span class="country-value">{{ formatNumber(country.value) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!--地图下方的四个小图-->
    <div class="resource-chart-container">
      <div class="resource-chart-sequence-year">
        <ECharts :option="sequenceYearOption" width="90%" height="100%" color="#ff00ff"></ECharts>
      </div>
      <div class="resource-chart-serovar">
        <ECharts :option="serovarPieOption" width="90%" height="100%" color="#ff00ff"></ECharts>
      </div>
      <div class="resource-chart-st">
        <ECharts :option="stPieOption" width="90%" height="100%" color="#ff00ff"></ECharts>
      </div>
      <div class="resource-chart-sankey">
        <ECharts :option="sankeyOption" width="90%" height="100%" color="#ff00ff"></ECharts>
      </div>
    </div>

    <!-- 表格,显示基因组的详细信息-->
    <div class="resource-table-metadata-container" style="margin: 20px 0">
      <div class="table-wrapper">
        <ResourceTable
          :table-data="metaTableData"
          :columns="metaTableColumnsWithSearch"
          title="| Metadata Table"
          :default-col-min-width="60"
          :default-col-max-width="300"
          :pagination="pagination"
          :height="500"
          :table-style="{ minWidth: '100px' }"
          :default-sortable="true"
          :fetch-all-data-function="fetchAllMetaListData"
          :selected-all-pages-data="allMetaSelectedData"
          row-key="id"
          @selection-change="handleSelectionChange"
          @sort-change="handleMetaSortChange"
          @search="handleMetaSearch"
          @update:selected-all-pages-data="(data: any[]) => (allMetaSelectedData = data)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MapECharts from "@/components/MapECharts/worldMap.vue";
import ECharts from "@/components/ECharts/index.vue";
import ResourceTable from "@/components/ResourceTable.vue";

import {
  getMetaListApi,
  getWorldmapApi,
  getSequenceYearApi,
  getSerovarApi,
  getHostApi,
  getSTApi,
  getSankeyApi
} from "@/api/modules/resourcepage";
import { ref, onMounted, reactive, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { Resource } from "@/api/interface/resourcepage";
import { formatNumber } from "@/utils/format";

const mapData = ref<Array<{ name: string; value: number }>>([]);

// 地图筛选条件
const mapFilters = reactive({
  serovar: [] as string[],
  host: [] as string[],
  onehealth: [] as string[]
  //yearRange: []
});

// 筛选选项
const serovarOptions = ref<Array<{ label: string; value: string }>>([]);
const hostOptions = ref<Array<{ label: string; value: string }>>([]);
const oneHealthOptions = ref<Array<{ label: string; value: string }>>([]);
const sequenceYearOption = ref<any>({});
const serovarPieOption = ref<any>({});
const stPieOption = ref<any>({});
const sankeyOption = ref<any>({});
const { t } = useI18n();
const topCountries = ref<Array<{ name: string; value: number }>>([]);
const metaTableData = ref<any[]>([]);
// 表格选中行数据
const selectedRows = ref<any[]>([]);
const allMetaSelectedData: any[] = [];

// 添加全选功能相关变量
const checkAll = ref(false);
const indeterminate = ref(false);
const hostCheckAll = ref(false);
const oneHealthCheckAll = ref(false);
const hostIndeterminate = ref(false);
const oneHealthIndeterminate = ref(false);

// 定义计算bar宽度的函数，基于对数比例
const getBarWidth = (value: number): string => {
  if (topCountries.value.length === 0) return "0px";

  // 获取最大值用于比例计算
  const maxValue = Math.max(...topCountries.value.map(item => item.value));

  // 计算对数
  const logValue = Math.log10(value + 1);
  const maxLogValue = Math.log10(maxValue + 1);

  // 设置最大宽度
  const maxWidth = 300;

  // 按比例计算宽度
  const width = (logValue / maxLogValue) * maxWidth;
  //console.log("Bar width for value", value, ":", width);
  return `${Math.max(width, 5)}px`; // 最小宽度为5px
};

const getWorldmapData = async () => {
  try {
    const params = {
      ...mapFilters,
      serovar: mapFilters.serovar.join(","),
      onehealth: mapFilters.onehealth.join(","),
      host: mapFilters.host.join(",")
    };
    const { data } = await getWorldmapApi(params);
    // 转换数据格式以适配前端组件
    mapData.value = data.list.map(item => ({
      name: item.country,
      value: item.number,
      text: "\n"
      //text: "Country: " + item.country + "\nSequences: " + item.number
    }));

    // 获取前10个国家用于右侧显示
    const sortedData = [...data.list].sort((a, b) => b.number - a.number);
    topCountries.value = sortedData.slice(0, 10).map(item => ({
      name: item.country,
      value: item.number
    }));
  } catch (error) {
    console.error("获取世界地图数据失败:", error);
  }
};

// 处理全选
const handleCheckAll = (val: any) => {
  indeterminate.value = false;
  if (val) {
    mapFilters.serovar = serovarOptions.value.map(_ => _.value);
  } else {
    mapFilters.serovar = [];
  }
};

// 处理宿主全选
const handleHostCheckAll = (val: any) => {
  hostIndeterminate.value = false;
  if (val) {
    mapFilters.host = hostOptions.value.map(_ => _.value);
  } else {
    mapFilters.host = [];
  }
};

//处理OneHealth全选
const handleOneHealthCheckAll = (val: any) => {
  oneHealthIndeterminate.value = false;
  if (val) {
    mapFilters.onehealth = oneHealthOptions.value.map(_ => _.value);
  } else {
    mapFilters.onehealth = [];
  }
};

// 重置地图筛选条件
const resetMapFilters = () => {
  mapFilters.serovar = [];
  mapFilters.host = [];
  mapFilters.onehealth = [];
  //mapFilters.yearRange = [];
  checkAll.value = false;
  indeterminate.value = false;
  hostCheckAll.value = false;
  oneHealthCheckAll.value = false;
  hostIndeterminate.value = false;
  oneHealthIndeterminate.value = false;
  getWorldmapData();
};

// 添加一个响应式变量来跟踪组件是否已挂载
//const isComponentMounted = ref(true);

// 获取宿主选项
const getHostOptions = async () => {
  try {
    // 直接调用getHostApi获取宿主选项，不再分页获取全部数据
    const res: any = await getHostApi();

    // 处理宿主统计数据
    if (res && res.data && res.data.list) {
      // 获取所有宿主值
      hostOptions.value = res.data.list.map((item: any) => ({
        label: item.host,
        value: item.host
      }));
      console.log("宿主选项数据处理完成，hostOptions:", hostOptions.value);
    } else {
      console.warn("宿主选项数据格式不正确或为空:", res);
    }
  } catch (error: any) {
    console.error("获取宿主选项失败:", error);
  }
};

// 获取血清型选项
const getSerovarOptions = async () => {
  try {
    // 直接调用getSerovarApi获取血清型选项，不再分页获取全部数据
    const res: any = await getSerovarApi({ _t: Date.now() + "_serovarPie" });

    // 处理血清型统计数据
    if (res && res.data && res.data.list) {
      // 获取所有血清型值
      serovarOptions.value = res.data.list.map((item: any) => ({
        label: item.serovar,
        value: item.serovar
      }));
      console.log("血清型选项数据处理完成，serovarOptions:", serovarOptions.value);
    } else {
      console.warn("血清型选项数据格式不正确或为空:", res);
    }
  } catch (error: any) {
    console.error("获取血清型选项失败:", error);
    // 使用模拟数据作为备选
    serovarOptions.value = [
      { label: "Typhimurium", value: "Typhimurium" },
      { label: "Enteritidis", value: "Enteritidis" },
      { label: "Newport", value: "Newport" },
      { label: "Javiana", value: "Javiana" }
    ];
    console.log("使用模拟数据作为血清型选项:", serovarOptions.value);
  }
};

// 获取OneHealth选项
const getOneHealthOptions = async () => {
  // try {
  //   // 构造参数获取所有数据，设置一个更大的limit值
  //   const params: any = {
  //     curPage: 1,
  //     limit: 500000 // 增加limit以确保能获取所有46万条数据
  //   };

  //   console.log("开始获取OneHealth选项数据，参数:", params);
  //   // 正确传递参数，将cancel配置作为第三个参数传递
  //   //const res: any = await getMetaListApi(params);
  //   const res: any = await getMetaListApi({ ...params, _t: Date.now() + "_oneHealth" }); // getHostOptions

  //   console.log("OneHealth选项API调用完成，响应数据:", res);

  //   // 检查组件是否仍然挂载
  //   if (!isComponentMounted.value) {
  //     console.log("组件已卸载，停止处理OneHealth选项数据");
  //     return; // 组件已卸载，不继续处理
  //   }

  //   // 处理OneHealth统计数据
  //   if (res && res.data && res.data.list) {
  //     // 获取所有OneHealth值
  //     const oneHealths = new Set<string>();

  //     res.data.list.forEach((item: any) => {
  //       const oneHealth = item.oneHealth;
  //       if (oneHealth) {
  //         oneHealths.add(oneHealth);
  //       }
  //     });

  //     // 更新OneHealth选项
  //     oneHealthOptions.value = Array.from(oneHealths).map(oneHealth => ({
  //       label: oneHealth,
  //       value: oneHealth
  //     }));
  //     console.log("OneHealth选项数据处理完成，oneHealthOptions:", oneHealthOptions.value);
  //   } else {
  //     console.warn("OneHealth选项数据格式不正确或为空:", res);
  //   }
  // } catch (error: any) {
  //   // 检查组件是否仍然挂载
  //   if (!isComponentMounted.value) {
  //     console.log("组件已卸载，忽略OneHealth选项获取错误");
  //     return;
  //   }

  //   // 检查是否是请求取消错误
  //   if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
  //     console.log("获取OneHealth选项请求被取消:", error.message);
  //     return; // 请求被取消，正常现象，不需要处理
  //   }

  //   console.error("获取OneHealth选项失败:", error);
  // 使用模拟数据作为备选
  oneHealthOptions.value = [
    { label: "Human", value: "Human" },
    { label: "Animal", value: "Animal" },
    { label: "Environment", value: "Environment" },
    { label: "Food", value: "Food" }
  ];
  console.log("使用模拟数据作为OneHealth选项:", oneHealthOptions.value);
  //}
};

//每年测序的基因组数据
const getSequenceYearData = async () => {
  try {
    const { data } = await getSequenceYearApi();
    const years: number[] = [];
    const values: number[] = [];

    data.list.forEach(item => {
      years.push(item.year);
      values.push(item.number);
      //values.push(Math.log10(item.number)); //绘制对数坐标轴
    });
    sequenceYearOption.value = {
      title: {
        text: t("resource.sequencePerYear_title"),
        left: "center",
        top: "5%",
        textStyle: {
          fontSize: 14,
          fontWeight: "bold",
          color: "#333"
        }
      },
      tooltip: {
        // 鼠标放上去的数据提示框
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      // toolbox: {
      //   feature: {
      //     dataZoom: {
      //       yAxisIndex: false
      //     },
      //     saveAsImage: {
      //       pixelRatio: 2
      //     }
      //   }
      // },
      grid: {
        left: "10%",
        right: "5%",
        top: "20%",
        bottom: 50,
        containLabel: true
      },
      dataZoom: [
        {
          type: "inside"
        },
        {
          type: "slider"
        }
      ],
      xAxis: {
        type: "category",
        data: years,
        silent: false,
        splitLine: {
          show: false
        },
        splitArea: {
          show: false
        }
      },
      yAxis: {
        type: "value",
        name: t("resource.sequencePerYear_yaxis"),
        nameLocation: "middle",
        nameGap: 50,
        nameRotate: 90,
        axisLabel: {
          //margin: 10,
          overflow: "break",
          formatter: (value: number) => {
            if (value === 0 || !isFinite(value)) {
              return "0";
            }
            return value.toString();
          }
        },
        splitArea: {
          show: false
        },
        logBase: 10
      },
      series: [
        {
          type: "bar",
          data: values,
          large: true,
          largeThreshold: 100,
          progressive: 2000,
          progressiveThreshold: 3000,
          animation: false
        }
      ]
    };
  } catch (error) {
    console.error("获取每年测序量数据失败:", error);
  }
};

//血清型饼图数据
const getSerovarPieData = async () => {
  try {
    const { data } = await getSerovarApi();
    const serovars: string[] = [];
    const values: number[] = [];

    data.list.forEach(item => {
      serovars.push(item.serovar);
      values.push(item.number);
      //values.push(Math.log10(item.number)); //绘制对数坐标轴
    });
    // 构造饼图数据
    const pieData = serovars.map((serovar, index) => {
      // 定义颜色数组
      const colors = [
        "#5470c6",
        "#91cc75",
        "#fac858",
        "#fc8452",
        "#ee6666",
        "#73c0de",
        "#3ba272",
        "#9a60b4",
        "#ea7ccc",
        "#fac8ee",
        "#e5e5e5"
      ];
      return {
        name: serovar,
        value: values[index],
        itemStyle: {
          color: colors[index % colors.length]
        }
      };
    });
    serovarPieOption.value = {
      title: {
        text: t("resource.serovarPie_title"),
        //text: "Serovar Pie Chart",
        left: "center",
        top: "5%",
        textStyle: {
          fontSize: 14,
          fontWeight: "bold",
          color: "#333"
        }
      },
      tooltip: {
        trigger: "item"
      },
      legend: {
        orient: "vertical",
        left: "bottom"
      },
      series: [
        {
          //name: "Serovar Pie Chart",
          type: "pie",
          radius: "50%",
          data: pieData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    };
  } catch (error) {
    console.error("获取serovar数据失败:", error);
  }
};
//ST饼图数据
const getSTPieData = async () => {
  try {
    const { data } = await getSTApi();
    const sts: string[] = [];
    const values: number[] = [];

    data.list.forEach(item => {
      sts.push(item.st);
      values.push(item.number);
      //values.push(Math.log10(item.number)); //绘制对数坐标轴
    });
    // 构造饼图数据
    const pieData = sts.map((st, index) => {
      // 定义颜色数组
      const colors = [
        "#5470c6",
        "#91cc75",
        "#fac858",
        "#fc8452",
        "#ee6666",
        "#73c0de",
        "#3ba272",
        "#9a60b4",
        "#ea7ccc",
        "#fac8ee",
        "#e5e5e5"
      ];
      return {
        name: st,
        value: values[index],
        itemStyle: {
          color: colors[index % colors.length]
        }
      };
    });
    stPieOption.value = {
      title: {
        text: t("resource.stPie_title"),
        //text: "Serovar Pie Chart",
        left: "center",
        top: "5%",
        textStyle: {
          fontSize: 14,
          fontWeight: "bold",
          color: "#333"
        }
      },
      tooltip: {
        trigger: "item"
      },
      legend: {
        orient: "vertical",
        left: "bottom"
      },
      series: [
        {
          type: "pie",
          radius: "50%",
          data: pieData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    };
  } catch (error) {
    console.error("获取ST数据失败:", error);
  }
};

//桑基图数据格式化函数
const formatSankeyData = (
  rawData: Resource.ResSankey
): { nodes: { name: string }[]; links: { source: string; target: string; value: number }[] } => {
  const nodesSet = new Set<string>();
  const links: { source: string; target: string; value: number }[] = [];

  rawData.list.forEach(({ serovar, st, number }) => {
    // 添加节点到集合中
    nodesSet.add(serovar).add(st);

    // 创建链接
    links.push({
      source: serovar,
      target: st,
      value: number
    });
  });

  // 将集合转换为数组，并为每个节点生成{name: nodeName}对象
  const nodes = Array.from(nodesSet).map(name => ({ name }));
  return { nodes, links };
};

const getSankeyData = async () => {
  try {
    // 调用API获取数据
    const response = await getSankeyApi();
    const rawData = response.data;
    const formattedData = formatSankeyData(rawData);

    // 设置图表选项
    sankeyOption.value = {
      series: [
        {
          type: "sankey",
          data: formattedData.nodes,
          links: formattedData.links,
          emphasis: {
            focus: "adjacency"
          },
          lineStyle: {
            curveness: 0.5
          },
          label: {
            show: true,
            position: "right"
          },
          nodeAlign: "justify"
        }
      ],
      title: {
        text: t("resource.serovarSTSankey_title"),
        //text: "Sankey Diagram",
        left: "center",
        top: "0",
        textStyle: {
          fontSize: 14,
          fontWeight: "bold",
          color: "#333"
        }
      },
      grid: {
        left: "10%",
        right: "10%",
        top: "20%",
        bottom: "10%",
        containLabel: true
      },
      tooltip: {
        trigger: "item",
        triggerOn: "mousemove"
      }
    };

    console.log("Sankey data:", formattedData); // 用于调试
  } catch (error) {
    console.error("Error fetching sankey data:", error);
  }
};

// 处理表格选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection;
};

// 导出选中数据

// 监听血清型筛选值的变化，更新全选状态
watch(
  () => mapFilters.serovar,
  val => {
    if (!val || val.length === 0) {
      checkAll.value = false;
      indeterminate.value = false;
    } else if (val.length === serovarOptions.value.length) {
      checkAll.value = true;
      indeterminate.value = false;
    } else {
      indeterminate.value = true;
    }
  }
);

// 监听宿主筛选值的变化，更新全选状态
watch(
  () => mapFilters.host,
  val => {
    if (!val || val.length === 0) {
      hostCheckAll.value = false;
      hostIndeterminate.value = false;
    } else if (val.length === hostOptions.value.length) {
      hostCheckAll.value = true;
      hostIndeterminate.value = false;
    } else {
      hostIndeterminate.value = true;
    }
  }
);

// 监听OneHealth筛选值的变化，更新全选状态
watch(
  () => mapFilters.onehealth,
  val => {
    if (!val || val.length === 0) {
      oneHealthCheckAll.value = false;
      oneHealthIndeterminate.value = false;
    } else if (val.length === oneHealthOptions.value.length) {
      oneHealthCheckAll.value = true;
      oneHealthIndeterminate.value = false;
    } else {
      oneHealthIndeterminate.value = true;
    }
  }
);

// 分页相关数据
const pagination = reactive({
  currentPage: 1, //加载页面时设置当前为第一页
  pageSize: 10, //每页显示的记录数
  total: 0,
  pageSizes: [10, 20, 50],
  onSizeChange: (val: number) => {
    pagination.pageSize = val;
    getMetaList();
  },
  onCurrentChange: (val: number) => {
    console.log("切换到:", val, "页");
    pagination.currentPage = val;
    getMetaList();
  }
});

// 搜索过滤器
const metaSearchFilters = reactive<Record<string, string>>({});

// 表格列定义（带搜索功能）
const metaTableColumns = ref([
  { type: "selection" },
  { type: "index", label: t("resource.table_index"), width: 65 },
  { prop: "strain", label: t("resource.strain"), minWidth: 120, searchable: true, sortable: true },
  { prop: "serovar", label: t("resource.serovar"), minWidth: 120, searchable: true, sortable: true },
  { prop: "st", label: t("resource.st"), minWidth: 120, searchable: true, sortable: true },
  { prop: "isolationSource", label: t("resource.isolation_source"), minWidth: 180, searchable: true, sortable: true },
  { prop: "host", label: t("resource.host"), minWidth: 120, searchable: true, sortable: true },
  { prop: "collectionYear", label: t("resource.year"), minWidth: 180, searchable: true, sortable: true },
  { prop: "country", label: t("resource.country"), minWidth: 120, searchable: true, sortable: true },
  { prop: "oneHealth", label: t("resource.oneHealth"), minWidth: 180, searchable: true, sortable: true },
  { prop: "oneHealth2", label: t("resource.oneHealth2"), minWidth: 180, searchable: true, sortable: true },
  { prop: "oneHealth3", label: t("resource.oneHealth3"), minWidth: 180, searchable: true, sortable: true },
  { prop: "argNumber", label: t("resource.arg_number"), minWidth: 180, searchable: true, sortable: true },
  { prop: "argList", label: t("resource.arg_list"), minWidth: 180, searchable: true, sortable: true },
  //{ prop: "plasmidNumber", label: t("resource.plasmid_number"), minWidth: 120, searchable: true, sortable: true },
  { prop: "plasmidList", label: t("resource.plasmid_list"), minWidth: 180, searchable: true, sortable: true },
  { prop: "vfNumber", label: t("resource.vf_number"), minWidth: 180, searchable: true, sortable: true },
  { prop: "invasive", label: t("resource.invasive"), minWidth: 120, searchable: true, sortable: true }
]);

// 带搜索功能的列定义
const metaTableColumnsWithSearch = computed(() => {
  return metaTableColumns.value.map(col => {
    if (col.searchable) {
      return {
        ...col,
        searchValue: metaSearchFilters[col.prop] || ""
      };
    }
    return col;
  });
});

// 排序参数
const metaSortParams = reactive({
  sidx: "",
  order: ""
});

// 搜索防抖定时器
const searchDebounceTimers = ref<{ [key: string]: NodeJS.Timeout }>({});

// 修改 getMetaList 方法，添加搜索参数
const getMetaList = async () => {
  try {
    // 构造参数，包括分页和搜索条件
    const params: any = {
      curPage: pagination.currentPage,
      limit: pagination.pageSize,
      sidx: metaSortParams.sidx,
      order: metaSortParams.order
    };

    // 添加列搜索条件
    Object.keys(metaSearchFilters).forEach(key => {
      if (metaSearchFilters[key]) {
        params[key] = metaSearchFilters[key];
      }
    });

    console.log("Search metatable:Sending request with params:", params);

    // 正确传递参数，将cancel配置作为第三个参数传递
    const res: any = await getMetaListApi(params);

    // 字段名映射
    const transformMetaItem = (item: any) => {
      return {
        id: item.strain, // 使用strain作为唯一标识符
        strain: item.strain,
        subspecies: item.subspecies1 || item.subspecies2 || "", // 后端字段名不同
        serovar: item.serovar,
        st: item.st,
        isolationSource: item.isolationSource,
        host: item.host,
        collectionYear: item.collectionYear,
        country: item.country,
        oneHealth: item.oneHealth,
        oneHealth2: item.oneHealthSecondary,
        oneHealth3: item.oneHealthTertiary,
        argNumber: item.argNumber,
        argList: item.argList,
        plasmidNumber: item.plasmidNumber,
        plasmidList: item.plasmidList,
        vfNumber: item.vfNumber,
        invasive: item.invasiveIndex
      };
    };

    // 根据实际返回的数据结构调整访问路径
    if (res && res.data) {
      // 转换数据格式以适配前端组件
      metaTableData.value = (res.data.list || []).map(transformMetaItem);
      pagination.total = res.data.totalCount || 0;
      console.log("Meta数据列表:", res);
    } else {
      metaTableData.value = [];
      pagination.total = 0;
    }
  } catch (error) {
    console.error("获取Meta数据失败:", error);
    metaTableData.value = [];
    pagination.total = 0;
  }
};

// 获取所有Meta数据（用于导出）
const fetchAllMetaListData = async (extraParams = {}) => {
  try {
    const params: any = {
      curPage: 1,
      limit: 100000, // 设置一个足够大的数字以获取所有数据
      sidx: metaSortParams.sidx,
      order: metaSortParams.order,
      ...extraParams
    };

    // 添加列搜索条件
    Object.keys(metaSearchFilters).forEach(key => {
      if (metaSearchFilters[key]) {
        params[key] = metaSearchFilters[key];
      }
    });
    console.log("MetaTable API request params:", { ...params });

    const res: any = await getMetaListApi(params);

    // 字段名映射
    const transformMetaItem = (item: any) => {
      return {
        id: item.strain, // 使用strain作为唯一标识符
        strain: item.strain,
        subspecies: item.subspecies1 || item.subspecies2 || "", // 后端字段名不同
        serovar: item.serovar,
        st: item.st,
        isolationSource: item.isolationSource,
        host: item.host,
        collectionYear: item.collectionYear,
        country: item.country,
        oneHealth: item.oneHealth,
        oneHealth2: item.oneHealthSecondary,
        oneHealth3: item.oneHealthTertiary,
        argNumber: item.argNumber,
        argList: item.argList,
        plasmidNumber: item.plasmidNumber,
        plasmidList: item.plasmidList,
        vfNumber: item.vfNumber,
        invasive: item.invasiveIndex
      };
    };

    // 根据实际返回的数据结构调整访问路径
    if (res && res.data) {
      // 转换数据格式以适配前端组件
      return (res.data.list || []).map(transformMetaItem);
    }
    return [];
  } catch (error) {
    console.error("获取所有Meta数据失败:", error);
    throw error;
  }
};

const handleMetaSortChange = (sortInfo: { column: any; prop: string; order: string }) => {
  if (sortInfo.order) {
    metaSortParams.sidx = sortInfo.prop;
    metaSortParams.order = sortInfo.order === "ascending" ? "asc" : "desc";
  } else {
    metaSortParams.sidx = "";
    metaSortParams.order = "";
  }
  getMetaList();
};

const handleMetaSearch = (prop: string, value?: string) => {
  // 清除之前的定时器
  if (searchDebounceTimers.value[prop]) {
    clearTimeout(searchDebounceTimers.value[prop]);
  }

  // 设置新的防抖定时器
  searchDebounceTimers.value[prop] = setTimeout(() => {
    // 如果提供了value参数，则直接使用它更新搜索过滤器
    if (value !== undefined) {
      console.log("Received search value from input event:", prop, value);
      metaSearchFilters[prop] = value;
    } else {
      // 否则，从ResourceTable组件获取搜索值并更新过滤器
      const column = metaTableColumnsWithSearch.value.find(col => col.prop === prop && col.searchable);
      if (column && column.searchable && typeof (column as any).searchValue === "string") {
        console.log("Retrieved search value from column config:", prop, (column as any).searchValue);
        metaSearchFilters[prop] = (column as any).searchValue;
      }
    }

    console.log("Updated metaSearchFilters:", { ...metaSearchFilters });

    // 重置分页到第一页
    pagination.currentPage = 1;

    // 触发数据重新获取
    getMetaList();
  }, 300); // 300ms 防抖延迟
};

onMounted(() => {
  console.log("Resource组件已挂载，开始加载数据");
  //调用所有必要的数据加载方法
  getSankeyData();
  getSTPieData();

  getWorldmapData();
  getMetaList();
  getSequenceYearData();
  getSerovarPieData();
  getHostOptions();
  getSerovarOptions(); // 添加血清型选项获取
  getOneHealthOptions(); // 添加OneHealth选项获取

  console.log("Resource组件数据加载方法已调用");
});
</script>

<style scoped lang="scss">
@import "./index";
</style>
