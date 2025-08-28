<template>
  <div class="resource-container">
    <div class="resource-map">
      <!-- 地图,显示基因组序列的地理分布。需要有筛选栏，根据 serovar，ST，country,Collection Year 等字段筛选序列-->
      <div class="map-filter"></div>
      <!-- <MapECharts :option="worldMapOption" width="800px" height="400px" /> -->
      <MapECharts :map-data="mapData" />
    </div>

    <!--地图下方的四个小图-->
    <div class="resource-chart-container">
      <div class="resource-chart-sequence-year">
        <!-- <SequenceYearChart :data="sequenceYearData" /> -->
        <ECharts :option="sequenceYearOption" width="90%" height="100%" color="#ff00ff"></ECharts>
      </div>
      <div class="resource-chart-serovar">
        <!-- <SerovarPieChart :data="serovarPieData" /> -->
        <ECharts :option="serovarPieOption" width="90%" height="100%" color="#ff00ff"></ECharts>
      </div>
      <div class="resource-chart-st">
        <STPieChart :data="stPieData" />
      </div>
      <div class="resource-chart-sankey">
        <SerovarSTSankeyChart :data="serovarSTSankeyData" />
      </div>
    </div>

    <div class="resource-table-container">
      <el-card>
        <div width="800px" height="400px" color="#ff0000">
          <el-table :data="metaTableData" border stripe>
            <el-table-column type="index" label="序号" />
            <el-table-column prop="strain" label="菌株" />
            <!-- <el-table-column prop="subspecies" label="亚种" /> -->
            <el-table-column prop="serovar" label="血清型" />
            <el-table-column prop="st" label="ST型" />
            <el-table-column prop="isolationSource" label="分离来源" />
            <el-table-column prop="host" label="宿主" />
            <el-table-column prop="collectionYear" label="采集年份" />
            <el-table-column prop="country" label="国家" />
            <el-table-column prop="oneHealth" label="OneHealth" />
            <el-table-column prop="onehealth2" label="OneHealth2" />
            <el-table-column prop="oneHealth3" label="OneHealth3" />
            <el-table-column prop="argNumber" label="耐药基因数" />
            <el-table-column prop="vfNumber" label="毒力基因数" />
            <el-table-column prop="invasive" label="侵袭指数" />
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
import STPieChart from "@/components/ECharts/stPie.vue";
import SerovarSTSankeyChart from "@/components/ECharts/serovarSTSankey.vue";

import { getMetaListApi, getWorldmapApi, getSequenceYearApi, getSerovarApi } from "@/api/modules/resourcepage";
import { ref, onMounted, reactive } from "vue";
import { useI18n } from "vue-i18n";

const mapData = ref<Array<{ name: string; value: number }>>([]);
//const sequenceYearOption = ref<Array<{ year: number; value: number }>>([]);
const sequenceYearOption = ref<any>({});
const serovarPieOption = ref<any>({});
const { t } = useI18n();
const getWorldmapData = async () => {
  try {
    const { data } = await getWorldmapApi();
    // 转换数据格式以适配前端组件
    mapData.value = data.list.map(item => ({
      name: item.country,
      value: item.number
    }));
  } catch (error) {
    console.error("获取世界地图数据失败:", error);
  }
};
// const mapData = ref([
//   { country: "China", value: 1000 },
//   { country: "United States", value: 80000 }
//   // 可根据实际情况替换或扩展数据
// ]);

//每年测序的基因组数量
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
    console.error("获取序列年份数据失败:", error);
  }
};

const getSerovarData = async () => {
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
        "#ee6666",
        "#73c0de",
        "#3ba272",
        "#9a60b4",
        "#ea7ccc",
        "#fc8452",

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
          name: "Serovar Pie Chart",
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
// 示例柱状图数据
// const sequenceYearData = ref([
//   { year: 2020, value: 120 },
//   { year: 2021, value: 180 },
//   { year: 2022, value: 150 }
// ]);

// const getSerovarPieData = async () => {

// };
// 示例饼图数据
// const serovarPieData = ref([
//   { name: "Typhimurim", value: 300 },
//   { name: "Enteritidis", value: 200 },
//   { name: "Newport", value: 150 }
// ]);
// 示例ST饼图数据
const stPieData = ref([
  { name: "ST19", value: 300 },
  { name: "ST32", value: 200 },
  { name: "ST11", value: 200 }
]);

const serovarSTSankeyData = ref({
  nodes: [{ name: "Typhimurim" }, { name: "Enteritidis" }, { name: "ST19" }, { name: "ST32" }],
  links: [
    { source: "Typhimurim", target: "ST19", value: 120 },
    { source: "Enteritidis", target: "ST32", value: 80 }
  ]
});

// 保存Meta信息列表
const metaTableData = ref<any[]>([]);

// 分页相关数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

const getMetaList = async () => {
  try {
    // 使用更简单的参数格式
    const params = {
      curPage: pagination.currentPage,
      limit: pagination.pageSize
    };

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

    // // 使用虚拟数据进行测试
    // const mockData: any[] = [
    //   {
    //     strain: "LT2",
    //     subspecies: "Salmonella enterica subsp. enterica",
    //     serovar: "Typhimurium",
    //     st: "ST19",
    //     isolationSource: "Human stool",
    //     host: "Homo sapiens",
    //     collectionYear: "2015",
    //     country: "China",
    //     oneHealth: "Yes",
    //     onehealth2: "No",
    //     oneHealth3: "Yes",
    //     argNumber: "12",
    //     vfNumber: "8",
    //     invasive: "High"
    //   },
    //   {
    //     strain: "SL1344",
    //     subspecies: "Salmonella enterica subsp. enterica",
    //     serovar: "Typhimurium",
    //     st: "ST24",
    //     isolationSource: "Mouse feces",
    //     host: "Mus musculus",
    //     collectionYear: "2018",
    //     country: "United States",
    //     oneHealth: "No",
    //     onehealth2: "Yes",
    //     oneHealth3: "No",
    //     argNumber: "9",
    //     vfNumber: "11",
    //     invasive: "Medium"
    //   },
    //   {
    //     strain: "NCTC13345",
    //     subspecies: "Salmonella enterica subsp. enterica",
    //     serovar: "Enteritidis",
    //     st: "ST32",
    //     isolationSource: "Chicken",
    //     host: "Gallus gallus",
    //     collectionYear: "2020",
    //     country: "United Kingdom",
    //     oneHealth: "Yes",
    //     onehealth2: "Yes",
    //     oneHealth3: "No",
    //     argNumber: "15",
    //     vfNumber: "6",
    //     invasive: "High"
    //   },
    //   {
    //     strain: "CVM27676",
    //     subspecies: "Salmonella enterica subsp. enterica",
    //     serovar: "Newport",
    //     st: "ST11",
    //     isolationSource: "Beef",
    //     host: "Bos taurus",
    //     collectionYear: "2019",
    //     country: "Canada",
    //     oneHealth: "No",
    //     onehealth2: "No",
    //     oneHealth3: "Yes",
    //     argNumber: "18",
    //     vfNumber: "7",
    //     invasive: "Medium"
    //   },
    //   {
    //     strain: "SC-B67",
    //     subspecies: "Salmonella enterica subsp. enterica",
    //     serovar: "Typhi",
    //     st: "ST45",
    //     isolationSource: "Human blood",
    //     host: "Homo sapiens",
    //     collectionYear: "2017",
    //     country: "India",
    //     oneHealth: "Yes",
    //     onehealth2: "No",
    //     oneHealth3: "Yes",
    //     argNumber: "22",
    //     vfNumber: "13",
    //     invasive: "Very High"
    //   }
    // ];

    // // 模拟分页数据
    // const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    // const endIndex = startIndex + pagination.pageSize;
    // metaTableData.value = mockData.slice(startIndex, endIndex);
    // pagination.total = mockData.length;
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
  pagination.currentPage = val;
  getMetaList();
};

onMounted(() => {
  getWorldmapData();
  getMetaList();
  getSequenceYearData();
  getSerovarData();
});
</script>

<style scoped lang="scss">
@import "./index";
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
