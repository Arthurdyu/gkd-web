<template>
  <div class="resource-container">
    <div class="resource-map">
      <!-- 地图,显示基因组序列的地理分布。需要有筛选栏，根据 serovar，ST，country,Collection Year 等字段筛选序列-->
      <div class="map-filter"></div>
      <MapECharts :select-area-code="selectAreaCode" :map-data="mapData" />
    </div>

    <!--地图下方的四个小图-->
    <div class="resource-chart-container">
      <div class="resource-chart-sequence-year">
        <SequenceYearChart :data="sequenceYearData" />
      </div>
      <div class="resource-chart-serovar">
        <SerovarPieChart :data="serovarPieData" />
      </div>
      <div class="resource-chart-st">
        <STPieChart :data="stPieData" />
      </div>
      <div class="resource-chart-sankey">
        <SerovarSTSankeyChart :data="serovarSTSankeyData" />
      </div>
    </div>

    <div class="resource-table-container">
      <div class="el-table__body-wrapper"></div>

      <!-- 表格，显示基因组序列信息，需要有筛选栏，根据 serovar，ST，country,Collection Year 等字段筛选序列 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import MapECharts from "@/components/MapECharts/worldMap.vue";
import SequenceYearChart from "@/components/ECharts/sequenceYear.vue";
import SerovarPieChart from "@/components/ECharts/serovarPie.vue";
import STPieChart from "@/components/ECharts/stPie.vue";
import SerovarSTSankeyChart from "@/components/ECharts/serovarSTSankey.vue";
import { ref } from "vue";

// 示例数据，根据实际情况替换
const selectAreaCode = ref(0);
const mapData = ref([
  { name: "China", value: 1000 },
  { name: "United States", value: 80000 }
  // 可根据实际情况替换或扩展数据
]);
// 示例柱状图数据
const sequenceYearData = ref([
  { year: 2020, value: 120 },
  { year: 2021, value: 180 },
  { year: 2022, value: 150 }
]);

// 示例饼图数据
const serovarPieData = ref([
  { name: "Typhimurim", value: 300 },
  { name: "Enteritidis", value: 200 },
  { name: "Newport", value: 150 }
]);
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
</script>

<style scoped lang="scss">
@import "./index";
</style>
