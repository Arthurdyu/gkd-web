<template>
  <div class="resource-container">
    <div class="map-filter">
      <div class="filter-bar">
        <!-- 血清型筛选 -->
        <div class="filter-item">
          <label>血清型:</label>
          <el-select
            v-model="mapFilters.serovar"
            multiple
            clearable
            collapse-tags
            placeholder="请选择血清型"
            popper-class="custom-header"
            :max-collapse-tags="1"
            @change="handleMapFilterChange"
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
          <label>宿主:</label>
          <el-select
            v-model="mapFilters.host"
            multiple
            clearable
            collapse-tags
            placeholder="请选择宿主"
            popper-class="custom-header"
            :max-collapse-tags="1"
            @change="handleMapFilterChange"
            style="width: 200px"
          >
            <template #header>
              <el-checkbox v-model="hostCheckAll" :indeterminate="hostIndeterminate" @change="handleHostCheckAll">
                All
              </el-checkbox>
            </template>
            <el-option v-for="item in hostOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <!-- 生境筛选 -->
        <div class="filter-item">
          <label>生境:</label>
          <el-select
            v-model="mapFilters.onehealth"
            multiple
            clearable
            collapse-tags
            placeholder="请选择生境"
            popper-class="custom-header"
            :max-collapse-tags="1"
            @change="handleMapFilterChange"
            style="width: 200px"
          >
            <template #header>
              <el-checkbox v-model="oneHealthCheckAll" :indeterminate="oneHealthIndeterminate" @change="handleOneHealthCheckAll">
                All
              </el-checkbox>
            </template>
            <el-option v-for="item in oneHealthOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>

        <!-- 年份区间筛选 -->
        <div class="filter-item">
          <label>年份区间:</label>
          <el-date-picker
            v-model="mapFilters.yearRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始年份"
            end-placeholder="结束年份"
            format="YYYY"
            value-format="YYYY"
            @change="handleMapFilterChange"
            style="width: 240px"
          />
        </div>

        <!-- 重置按钮 -->
        <div class="filter-item">
          <el-button @click="resetMapFilters">重置筛选</el-button>
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
            <!-- <div class="bar" :style="{ width: calculateWidth(country.value) + 'px' }"></div> -->
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
            :default-sort="{ prop: 'strain', order: 'ascending' }"
            style="width: 100%; height: 600px; overflow: auto; white-space: nowrap"
          >
            <el-table-column type="index" label="序号" />

            <el-table-column prop="strain" label="菌株" sortable>
              <template #header>
                <div style="display: flex; flex-direction: column; align-items: center; width: 100%; white-space: nowrap">
                  <!-- 第一行：span + 排序图标 -->
                  <span>菌株</span>
                  <el-input v-model="searchStrain" size="default" placeholder="搜索菌株" style="width: auto" />
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
                  <span>血清型</span>
                  <el-input v-model="searchSerovar" size="default" placeholder="搜索血清型" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="st" label="ST型" sortable>
              <template #header>
                <div style="display: flex; flex-direction: column; align-items: center">
                  <span>ST型</span>
                  <el-input v-model="searchST" size="default" placeholder="" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="isolationSource" label="分离来源" sortable>
              <template #header>
                <div style="display: flex; flex-direction: column; align-items: center">
                  <span>分离来源</span>
                  <el-input v-model="searchIsolationSource" size="default" placeholder="" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="host" label="宿主" sortable>
              <template #header>
                <div style="display: flex; flex-direction: column; align-items: center">
                  <span>宿主</span>
                  <el-input v-model="searchHost" size="default" placeholder="" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="collectionYear" label="采集年份" sortable>
              <template #header>
                <div style="display: flex; flex-direction: column; align-items: center">
                  <span>采集年份</span>
                  <el-input v-model="searchCollectionYear" size="default" placeholder="" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="country" label="国家" sortable>
              <template #header>
                <div style="display: flex; flex-direction: column; align-items: center">
                  <span>国家</span>
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
            <el-table-column prop="argNumber" label="耐药基因数" sortable>
              <!-- <template #header>
                <el-input v-model="searchArgNumber" size="default" placeholder="搜索耐药基因数" />
              </template> -->
            </el-table-column>
            <el-table-column prop="vfNumber" label="毒力基因数" sortable>
              <!-- <template #header>
                <el-input v-model="searchVfNumber" size="default" placeholder="搜索毒力基因数" />
              </template> -->
            </el-table-column>
            <el-table-column prop="invasive" label="侵袭指数" sortable>
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
  getSTApi,
  getSankeyApi
} from "@/api/modules/resourcepage";
import { ref, onMounted, reactive, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { Resource } from "@/api/interface/resourcepage";

const mapData = ref<Array<{ name: string; value: number }>>([]);

// 地图筛选条件
const mapFilters = reactive({
  serovar: [] as string[],
  host: [] as string[],
  onehealth: [] as string[],
  yearRange: []
});

// 表格筛选条件（保持原有分页筛选）
const tableFilters = reactive({
  serovar: "",
  host: "",
  yearRange: []
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

// 定义计算bar宽度的函数,log10)
const getBarWidth = (value: number): string => {
  const logValue = Math.log10(value + 1); // 避免log(0)
  const maxWidth = 300;
  const minWidth = 10;
  const width = (logValue / 5.5) * (maxWidth - minWidth) + minWidth;
  return `${width}px`;
};
//
// const calculateWidth = (value: number) => {
//   if (topCountries.value.length === 0) return 100;
//   const maxValue = Math.max(...topCountries.value.map(item => item.value));
//   // 最小宽度60px，最大宽度200px
//   return 60 + (value / maxValue) * 140;
// };
//世界地图数据

const getWorldmapData = async () => {
  try {
    const { data } = await getWorldmapApi();
    // 转换数据格式以适配前端组件
    mapData.value = data.list.map(item => ({
      name: item.country,
      value: item.number
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

// 处理地图筛选条件变化
const handleMapFilterChange = () => {
  // 只重新加载地图数据
  getWorldmapData();
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
  mapFilters.yearRange = [];
  checkAll.value = false;
  indeterminate.value = false;
  hostCheckAll.value = false;
  oneHealthCheckAll.value = false;
  hostIndeterminate.value = false;
  oneHealthIndeterminate.value = false;
  getWorldmapData();
};

// MetaList 获取宿主选项
const getHostOptions = async () => {
  try {
    // 构造参数获取所有数据
    const params: any = {
      curPage: 1,
      limit: 10000 // 获取足够多的数据用于选项展示
    };

    const res: any = await getMetaListApi(params);

    // 处理宿主统计数据
    if (res && res.data && res.data.list) {
      // 获取所有宿主值
      const hosts = new Set<string>();

      res.data.list.forEach((item: any) => {
        const host = item.host;
        if (host) {
          hosts.add(host);
        }
      });

      // 更新宿主选项
      hostOptions.value = Array.from(hosts).map(host => ({
        label: host,
        value: host
      }));
    }
  } catch (error) {
    console.error("获取宿主选项失败:", error);
    // 使用模拟数据作为备选
    hostOptions.value = [
      { label: "人类", value: "Human" },
      { label: "猪", value: "Pig" },
      { label: "牛", value: "Cattle" },
      { label: "鸡", value: "Chicken" },
      { label: "环境", value: "Environment" },
      { label: "鸭", value: "Duck" },
      { label: "羊", value: "Sheep" }
    ];
  }
};

// 获取血清型选项
const getSerovarOptions = async () => {
  try {
    // 构造参数获取所有数据
    const params: any = {
      curPage: 1,
      limit: 10000 // 获取足够多的数据用于选项展示
    };

    const res: any = await getMetaListApi(params);

    // 处理血清型统计数据
    if (res && res.data && res.data.list) {
      // 获取所有血清型值
      const serovars = new Set<string>();

      res.data.list.forEach((item: any) => {
        const serovar = item.serovar;
        if (serovar) {
          serovars.add(serovar);
        }
      });

      // 更新血清型选项
      serovarOptions.value = Array.from(serovars).map(serovar => ({
        label: serovar,
        value: serovar
      }));
    }
  } catch (error) {
    console.error("获取血清型选项失败:", error);
    // 使用模拟数据作为备选
    serovarOptions.value = [
      { label: "Typhimurium", value: "Typhimurium" },
      { label: "Enteritidis", value: "Enteritidis" },
      { label: "Newport", value: "Newport" },
      { label: "Javiana", value: "Javiana" }
    ];
  }
};

// 获取OneHealth选项
const getOneHealthOptions = async () => {
  try {
    // 构造参数获取所有数据
    const params: any = {
      curPage: 1,
      limit: 10000 // 获取足够多的数据用于选项展示
    };

    const res: any = await getMetaListApi(params);

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
    }
  } catch (error) {
    console.error("获取OneHealth选项失败:", error);
    // 使用模拟数据作为备选
    oneHealthOptions.value = [
      { label: "Human", value: "Human" },
      { label: "Animal", value: "Animal" },
      { label: "Environment", value: "Environment" }
    ];
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

//血清型数据
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
        //text: t("resource.serovar"),
        text: "Serovar Pie Chart",
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

// 示例ST饼图数据
// const stPieData = ref([
//   { name: "ST19", value: 300 },
//   { name: "ST32", value: 200 },
//   { name: "ST11", value: 200 }
// ]);

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

// 获取Meta列表
const getMetaList = async () => {
  try {
    // 使用更简单的参数格式
    const params: any = {
      curPage: pagination.currentPage,
      limit: pagination.pageSize
    };
    // 添加筛选条件
    if (tableFilters.serovar) params.serovar = tableFilters.serovar;
    if (tableFilters.host) params.host = tableFilters.host;
    if (tableFilters.yearRange && tableFilters.yearRange.length === 2) {
      params.startYear = tableFilters.yearRange[0];
      params.endYear = tableFilters.yearRange[1];
    }

    const res: any = await getMetaListApi(params);

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
      //metaTableData.value = res.data.list || [];
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

// 处理分页大小改变
const handleSizeChange = (val: number) => {
  pagination.pageSize = val;
  pagination.currentPage = 1;
  getMetaList();
};

// 处理当前页改变
const handleCurrentChange = (val: number) => {
  console.log("切换到:", val, "页");
  pagination.currentPage = val;
  getMetaList();
};

onMounted(() => {
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
});
</script>

<style scoped lang="scss">
@import "./index";
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  padding: 15px 0;
}
.filter-item {
  display: flex;
  gap: 8px;
  align-items: center;
}
.filter-item label {
  white-space: nowrap;
}
</style>
