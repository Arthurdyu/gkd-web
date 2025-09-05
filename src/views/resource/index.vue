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
          <!-- 调试信息 -->
          <!-- <div style="margin-left: 10px; font-size: 12px; color: #999999">选项数: {{ serovarOptions.length }}</div> -->
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
            <span class="country-value">{{ country.value }}</span>
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
    <div class="resource-table-container">
      <!-- 搜索 表头-->
      <el-card>
        <div width="800px" height="600px" color="#ff0000">
          <el-table
            :data="filterTableData"
            border
            height="250"
            :default-sort="{ prop: 'strain', order: 'ascending' }"
            style="width: 100%; height: 600px; overflow: auto; white-space: nowrap"
          >
            <el-table-column type="index" label="序号" />

            <el-table-column prop="strain" label="菌株" sortable>
              <template #header>
                <div style="display: flex; flex-direction: column; align-items: center; width: 100%; white-space: nowrap">
                  <!-- 第一行：span + 排序图标 -->
                  <span>{{ $t("resource.strain") }}</span>
                  <el-input
                    v-model="searchStrain"
                    size="default"
                    :placeholder="$t('resource.strain_select')"
                    style="width: auto"
                  />
                </div>
              </template>
            </el-table-column>

            <!-- <el-table-column prop="subspecies" label="亚种" sortable>
              <template #header>
                <div style="display: flex; flex-direction: column">
                  <span>亚种</span>
                  <el-input v-model="searchSubspecies" size="default" placeholder="" />
                </div>
              </template>
            </el-table-column> -->
            <el-table-column prop="serovar" label="血清型" sortable>
              <template #header>
                <div style="display: flex; flex-direction: column; align-items: center">
                  <span>{{ $t("resource.serovar") }}</span>
                  <el-input v-model="searchSerovar" size="default" :placeholder="$t('resource.select_serovar')" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="st" label="ST型" sortable>
              <template #header>
                <div style="display: flex; flex-direction: column; align-items: center">
                  <span>{{ $t("resource.st") }}</span>
                  <el-input v-model="searchST" size="default" placeholder="" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="isolationSource" label="分离来源" sortable>
              <template #header>
                <div style="display: flex; flex-direction: column; align-items: center">
                  <span>{{ $t("resource.isolation_source") }}</span>
                  <el-input v-model="searchIsolationSource" size="default" placeholder="" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="host" label="宿主" sortable>
              <template #header>
                <div style="display: flex; flex-direction: column; align-items: center">
                  <span>{{ $t("resource.host") }}</span>
                  <el-input v-model="searchHost" size="default" placeholder="" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="collectionYear" label="采集年份" sortable>
              <template #header>
                <div style="display: flex; flex-direction: column; align-items: center">
                  <span>{{ $t("resource.year") }}</span>
                  <el-input v-model="searchCollectionYear" size="default" placeholder="" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="country" label="国家" sortable>
              <template #header>
                <div style="display: flex; flex-direction: column; align-items: center">
                  <span>{{ $t("resource.country") }}</span>
                  <el-input v-model="searchCountry" size="default" placeholder="" />
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="oneHealth" label="OneHealth" sortable>
              <template #header>
                <span>OneHealth</span>
                <el-input v-model="searchOneHealth" size="default" placeholder="" />
              </template>
            </el-table-column>
            <el-table-column prop="onehealth2" label="OneHealth2" sortable>
              <template #header>
                <span>OneHealth2</span>
                <el-input v-model="searchOneHealth2" size="default" placeholder="" />
              </template>
            </el-table-column>
            <el-table-column prop="oneHealth3" label="OneHealth3" sortable>
              <template #header>
                <span>OneHealth3</span>
                <el-input v-model="searchOneHealth3" size="default" placeholder="" />
              </template>
            </el-table-column>
            <el-table-column prop="argNumber" :label="$t('ARG Number')" sortable>
              <!-- <template #header>
                <el-input v-model="searchArgNumber" size="default" placeholder="搜索耐药基因数" />
              </template> -->
            </el-table-column>
            <el-table-column prop="vfNumber" :label="$t('VF Number')" sortable>
              <!-- <template #header>
                <el-input v-model="searchVfNumber" size="default" placeholder="搜索毒力基因数" />
              </template> -->
            </el-table-column>
            <el-table-column prop="invasive" :label="$t('invasive')" sortable>
              <!-- <template #header>
                <el-input v-model="searchInvasive" size="default" placeholder="搜索侵袭指数" />
              </template> -->
            </el-table-column>
          </el-table>
        </div>

        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          class="pagination-container"
        />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import MapECharts from "@/components/MapECharts/worldMap.vue";
import ECharts from "@/components/ECharts/index.vue";
//import SerovarPieChart from "@/components/ECharts/serovarPie.vue";
//import STPieChart from "@/components/ECharts/stPie.vue";
//import SerovarSTSankeyChart from "@/components/ECharts/serovarSTSankey.vue";

import {
  getMetaListApi,
  getWorldmapApi,
  getSequenceYearApi,
  getSerovarApi,
  getHostApi,
  getSTApi,
  getSankeyApi
} from "@/api/modules/resourcepage";
import { ref, onMounted, onUnmounted, reactive, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { Resource } from "@/api/interface/resourcepage";
//import { totalmem } from "os";
//import { time_d } from "echarts/types/dist/shared";

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

// 定义计算bar宽度的函数，基于绝对值等比例
// const getBarWidth = (value: number): string => {
//   if (topCountries.value.length === 0) return "0px";

//   // 获取最大值用于比例计算
//   const maxValue = Math.max(...topCountries.value.map(item => item.value));

//   // 设置最大宽度
//   const maxWidth = 300;

//   // 按绝对值比例计算宽度
//   const width = (value / maxValue) * maxWidth;
//   console.log("Bar width for value", value, ":", width);
//   return `${Math.max(width, 5)}px`; // 最小宽度为5px
// };

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
const isComponentMounted = ref(true);
onUnmounted(() => {
  isComponentMounted.value = false;
});

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
    // 使用模拟数据作为备选
    hostOptions.value = [
      { label: "人类", value: "Human" },
      { label: "猪", value: "Pig" },
      { label: "牛", value: "Cattle" }
    ];
    console.log("使用模拟数据作为宿主选项:", hostOptions.value);
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
  try {
    // 构造参数获取所有数据，设置一个更大的limit值
    const params: any = {
      curPage: 1,
      limit: 500000 // 增加limit以确保能获取所有46万条数据
    };

    console.log("开始获取OneHealth选项数据，参数:", params);
    // 正确传递参数，将cancel配置作为第三个参数传递
    //const res: any = await getMetaListApi(params, {}, { cancel: false });
    const res: any = await getMetaListApi({ ...params, _t: Date.now() + "_oneHealth" }, {}, { cancel: false }); // getHostOptions

    console.log("OneHealth选项API调用完成，响应数据:", res);

    // 检查组件是否仍然挂载
    if (!isComponentMounted.value) {
      console.log("组件已卸载，停止处理OneHealth选项数据");
      return; // 组件已卸载，不继续处理
    }

    // 处理OneHealth统计数据
    if (res && res.data && res.data.list) {
      // 获取所有OneHealth值
      const oneHealths = new Set<string>();

      res.data.list.forEach((item: any) => {
        const oneHealth = item.oneHealth;
        if (oneHealth) {
          oneHealths.add(oneHealth);
        }
      });

      // 更新OneHealth选项
      oneHealthOptions.value = Array.from(oneHealths).map(oneHealth => ({
        label: oneHealth,
        value: oneHealth
      }));
      console.log("OneHealth选项数据处理完成，oneHealthOptions:", oneHealthOptions.value);
    } else {
      console.warn("OneHealth选项数据格式不正确或为空:", res);
    }
  } catch (error: any) {
    // 检查组件是否仍然挂载
    if (!isComponentMounted.value) {
      console.log("组件已卸载，忽略OneHealth选项获取错误");
      return;
    }

    // 检查是否是请求取消错误
    if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
      console.log("获取OneHealth选项请求被取消:", error.message);
      return; // 请求被取消，正常现象，不需要处理
    }

    console.error("获取OneHealth选项失败:", error);
    // 使用模拟数据作为备选
    oneHealthOptions.value = [
      { label: "Human", value: "Human" },
      { label: "Animal", value: "Animal" },
      { label: "Environment", value: "Environment" },
      { label: "Food", value: "Food" }
    ];
    console.log("使用模拟数据作为OneHealth选项:", oneHealthOptions.value);
  }
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
        text: t("resource.sequenceYearperYear_title"),
        left: "center"
      },
      tooltip: {
        // 鼠标放上去的数据提示框
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      xAxis: {
        type: "category",
        data: years,
        minInterval: 10
      },
      yAxis: {
        type: "value",
        name: t("resource.sequenceYearperYear"),
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
        logBase: 10
      },
      series: [
        {
          data: values,
          type: "bar"
        }
      ],
      grid: {
        left: "10%",
        right: "5%",
        top: "20%",
        bottom: "5%",
        containLabel: true
      }
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
        text: t("resource.serovar"),
        //text: "Serovar Pie Chart",
        left: "center"
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
        text: t("resource.st"),
        //text: "Serovar Pie Chart",
        left: "center"
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

// 表格搜索条件
const searchStrain = ref("");
const searchSerovar = ref("");
const searchSubspecies = ref("");
const searchST = ref("");
const searchIsolationSource = ref("");
const searchHost = ref("");
const searchCollectionYear = ref("");
const searchCountry = ref("");
const searchOneHealth = ref("");
const searchOneHealth2 = ref("");
const searchOneHealth3 = ref("");
const searchArgNumber = ref("");
const searchVfNumber = ref("");
const searchInvasive = ref("");

// 计算过滤后的表格数据
const filterTableData = computed(() => {
  return metaTableData.value.filter(data => {
    return (
      (!searchStrain.value || (data.strain && data.strain.toLowerCase().includes(searchStrain.value.toLowerCase()))) &&
      (!searchSubspecies.value ||
        (data.subspecies && data.subspecies.toLowerCase().includes(searchSubspecies.value.toLowerCase()))) &&
      (!searchSerovar.value || (data.serovar && data.serovar.toLowerCase().includes(searchSerovar.value.toLowerCase()))) &&
      (!searchST.value || (data.st && data.st.toLowerCase().includes(searchST.value.toLowerCase()))) &&
      (!searchIsolationSource.value ||
        (data.isolationSource && data.isolationSource.toLowerCase().includes(searchIsolationSource.value.toLowerCase()))) &&
      (!searchHost.value || (data.host && data.host.toLowerCase().includes(searchHost.value.toLowerCase()))) &&
      (!searchCollectionYear.value ||
        (data.collectionYear && data.collectionYear.toString().includes(searchCollectionYear.value))) &&
      (!searchCountry.value || (data.country && data.country.toLowerCase().includes(searchCountry.value.toLowerCase()))) &&
      (!searchOneHealth.value ||
        (data.oneHealth && data.oneHealth.toLowerCase().includes(searchOneHealth.value.toLowerCase()))) &&
      (!searchOneHealth2.value ||
        (data.onehealth2 && data.onehealth2.toLowerCase().includes(searchOneHealth2.value.toLowerCase()))) &&
      (!searchOneHealth3.value ||
        (data.oneHealth3 && data.oneHealth3.toLowerCase().includes(searchOneHealth3.value.toLowerCase()))) &&
      (!searchArgNumber.value || (data.argNumber && data.argNumber.toString().includes(searchArgNumber.value))) &&
      (!searchVfNumber.value || (data.vfNumber && data.vfNumber.toString().includes(searchVfNumber.value))) &&
      (!searchInvasive.value || (data.invasive && data.invasive.toString().includes(searchInvasive.value)))
    );
  });
});

// 分页相关数据
const pagination = reactive({
  currentPage: 1, //加载页面时设置当前为第一页
  pageSize: 10, //每页显示的记录数
  total: 0
});

// 修改 getMetaList 方法，添加搜索参数
const getMetaList = async () => {
  try {
    // 构造参数，包括分页和搜索条件
    const params: any = {
      curPage: pagination.currentPage,
      limit: pagination.pageSize
    };

    // 添加搜索条件
    if (searchStrain.value) params.strain = searchStrain.value;
    if (searchSubspecies.value) params.subspecies = searchSubspecies.value;
    if (searchSerovar.value) params.serovar = searchSerovar.value;
    if (searchST.value) params.st = searchST.value;
    if (searchIsolationSource.value) params.isolationSource = searchIsolationSource.value;
    if (searchHost.value) params.host = searchHost.value;
    if (searchCollectionYear.value) params.collectionYear = searchCollectionYear.value;
    if (searchCountry.value) params.country = searchCountry.value;
    if (searchOneHealth.value) params.oneHealth = searchOneHealth.value;
    if (searchOneHealth2.value) params.onehealth2 = searchOneHealth2.value;
    if (searchOneHealth3.value) params.oneHealth3 = searchOneHealth3.value;
    if (searchArgNumber.value) params.argNumber = searchArgNumber.value;
    if (searchVfNumber.value) params.vfNumber = searchVfNumber.value;
    if (searchInvasive.value) params.invasive = searchInvasive.value;

    // 正确传递参数，将cancel配置作为第三个参数传递
    const res: any = await getMetaListApi(params, {}, { cancel: false });

    // 字段名映射
    const transformMetaItem = (item: any) => {
      return {
        strain: item.strain,
        subspecies: item.subspecies1 || item.subspecies2 || "", // 后端字段名不同
        serovar: item.serovar,
        st: item.st,
        isolationSource: item.isolationSource,
        host: item.host,
        collectionYear: item.collectionYear,
        country: item.country,
        oneHealth: item.oneHealth,
        onehealth2: item.oneHealthSecondary,
        oneHealth3: item.oneHealthTertiary,
        argNumber: item.argNumber,
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

// 添加防抖函数，500ms后执行搜索
let searchTimeout: number | null = null;
const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    pagination.currentPage = 1; // 重置到第一页
    getMetaList();
  }, 500) as unknown as number;
};

// 监听所有搜索输入框的变化
watch(
  [
    searchStrain,
    searchSubspecies,
    searchSerovar,
    searchST,
    searchIsolationSource,
    searchHost,
    searchCollectionYear,
    searchCountry,
    searchOneHealth,
    searchOneHealth2,
    searchOneHealth3,
    searchArgNumber,
    searchVfNumber,
    searchInvasive
  ],
  () => {
    handleSearch();
  }
);

// 修改分页处理函数
const handleCurrentChange = (val: number) => {
  console.log("切换到:", val, "页");
  pagination.currentPage = val;
  getMetaList(); // 重新获取数据
};

const handleSizeChange = (val: number) => {
  pagination.pageSize = val;
  pagination.currentPage = 1; // 重置到第一页
  getMetaList(); // 重新获取数据
};

onMounted(() => {
  console.log("Resource组件已挂载，开始加载数据");
  //调用所有必要的数据加载方法
  getWorldmapData();
  getMetaList();
  getSequenceYearData();
  getSerovarPieData();
  getHostOptions();
  getSerovarOptions(); // 添加血清型选项获取
  getOneHealthOptions(); // 添加OneHealth选项获取
  getSTPieData();
  getSankeyData();
  console.log("Resource组件数据加载方法已调用");
});
</script>

<style scoped lang="scss">
@import "./index";

// .pagination-container {
//   display: flex;
//   justify-content: center;
//   margin-top: 20px;
// }
// .filter-bar {
//   display: flex;
//   flex-wrap: wrap;
//   gap: 20px;
//   align-items: center;
//   padding: 15px 0;
// }
// .filter-item {
//   display: flex;
//   gap: 8px;
//   align-items: center;
// }
// .filter-item label {
//   white-space: nowrap;
// }
</style>
