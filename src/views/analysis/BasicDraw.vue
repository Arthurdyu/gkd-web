<template>
  <div class="draw-chart-container">
    <!-- 上方图形卡片区 -->
    <div class="chart-card-list">
      <div
        v-for="(card, idx) in chartCards"
        :key="card.type"
        :class="['chart-card', { active: idx === activeIndex }]"
        @click="selectCard(idx)"
      >
        <!-- 图表缩略图 -->
        <img :src="card.thumbnail" :alt="card.name" class="chart-thumbnail" />
        <span>{{ card.name }}</span>
      </div>
    </div>

    <!-- 数据比对区域 -->
    <el-card id="database-data" class="middle-panel" style="margin: 32px 0">
      <template #header>
        <div class="card-header">
          <span>Database Data </span>
        </div>
      </template>
      <div class="group-forms group-forms-row">
        <div class="group-form" v-for="(group, index) in groups" :key="index">
          <el-divider>
            <h3>Group {{ index + 1 }}</h3>
          </el-divider>
          <el-form label-position="top">
            <div
              class="filter-selects"
              style="display: flex; flex-direction: column; align-items: center; justify-content: center"
            >
              <div style="width: 100%">
                <FilterSelect
                  label="Country"
                  :options="countryOptions"
                  :model-value="group.country"
                  placeholder="Select Country"
                  @update:model-value="val => (group.country = val)"
                />
              </div>

              <!-- 在 group-form 内使用 FilterSelect 组件 -->
              <div style="width: 100%">
                <FilterSelect
                  label="Serovar"
                  :options="serovarOptions"
                  :model-value="group.serovar"
                  placeholder="Select Serovar"
                  @update:model-value="val => (group.serovar = val)"
                />
              </div>

              <div style="width: 100%">
                <FilterSelect
                  label="Host"
                  :options="hostOptions"
                  :model-value="group.host"
                  placeholder="Select Host"
                  @update:model-value="val => (group.host = val)"
                />
              </div>

              <div style="width: 100%">
                <FilterSelect
                  label="One Health(Niches)"
                  :options="oneHealthOptions"
                  :model-value="group.oneHealth"
                  placeholder="Select One Health(Niches)"
                  @update:model-value="val => (group.oneHealth = val)"
                />
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <div class="compare-btn-center">
        <el-button type="primary" size="large" @click="compareGroups">Compare</el-button>
      </div>
    </el-card>

    <!-- 下方绘制区 -->
    <div class="chart-draw-area">
      <component :is="chartCards[activeIndex].component" v-bind="chartCards[activeIndex].props || {}" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VennChart from "@/components/EchartVeen.vue";
import SerotypePieChart from "@/components/ECharts/serovarPie.vue";
import FilterSelect from "@/components/FilterSelect.vue";

interface Option {
  label: string;
  value: string | number;
}

// 1. 选择场景一：大肠杆菌血清型数据
const eColiSerotypeData = [
  { name: "O157:H7", value: 35 },
  { name: "O121", value: 22 },
  { name: "O26", value: 18 },
  { name: "O111", value: 15 },
  { name: "O45", value: 8 },
  { name: "其他血清型", value: 2 }
];

const chartCards = [
  { name: "Venn Diagram", type: "venn", component: VennChart, thumbnail: "src/assets/images/icon/venn.png" },
  {
    name: "Bar Chart",
    type: "serovarPie",
    component: SerotypePieChart,
    thumbnail: "src/assets/images/icon/bar.png",
    props: { data: eColiSerotypeData }
  },
  { name: "Line Chart", type: "map", component: SerotypePieChart, thumbnail: "src/assets/images/icon/LineChart.png" },
  { name: "Linear Regression", type: "map", component: SerotypePieChart, thumbnail: "src/assets/images/icon/Regression.png" },
  { name: "Correlation Matrix", type: "map", component: SerotypePieChart, thumbnail: "src/assets/images/icon/Correlation.png" }
];

const activeIndex = ref(0);
const selectCard = (idx: number) => {
  activeIndex.value = idx;
};

// 定义选项数据
const countryOptions = ref<Option[]>([
  { label: "China", value: "CN" },
  { label: "USA", value: "US" },
  { label: "UK", value: "UK" }
]);

const serovarOptions = ref<Option[]>([
  { label: "Typhimurium", value: "typhimurium" },
  { label: "Enteritidis", value: "enteritidis" }
]);

const hostOptions = ref<Option[]>([
  { label: "Human", value: "human" },
  { label: "Animal", value: "animal" }
]);

const oneHealthOptions = ref<Option[]>([
  { label: "Clinical", value: "clinical" },
  { label: "Environmental", value: "environmental" }
]);

interface Group {
  country: (string | number)[];
  serovar: (string | number)[];
  host: (string | number)[];
  oneHealth: (string | number)[];
}

const groups = ref<Group[]>([
  { country: [], serovar: [], host: [], oneHealth: [] },
  { country: [], serovar: [], host: [], oneHealth: [] }
]);

const compareGroups = () => {
  // 比对逻辑
  console.log("Comparing groups:", groups.value);
};
</script>

<style scoped>
.draw-chart-container {
  display: flex;
  flex-direction: column;
  height: 150vh;
}
.chart-card-list {
  display: flex;
  align-items: center;
  height: 220px;
  padding: 20px 0;
  overflow-x: auto;
  background: #f7f7f7;
}
.chart-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 200px;
  padding: 12px;
  margin: 0 20px;
  font-size: 18px;
  cursor: pointer;
  background: #ffffff;
  border: 2px solid transparent;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
  transition: box-shadow 0.2s;
}

/* 缩略图样式 */
.chart-thumbnail {
  width: 140px;
  height: 140px;
  margin-bottom: 20px; /* 图片和文字之间的间距 */
  object-fit: cover; /* 图片按比例填充，超出部分裁剪 */
  object-fit: contain; /* 保持图片比例，不拉伸 */
  border-radius: 50%; /* 关键：将方形图片转为圆形 */
}
.chart-card.active {
  background-color: #fae7e9;
  border-color: #ce0e1f;

  /* box-shadow: 0 4px 16px rgb(64 158 255 / 15%); */
}
.chart-draw-area {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px;
  margin-top: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 6%);
}
.middle-panel {
  z-index: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.compare-btn-center {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.group-forms-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.group-form {
  width: 48%;
}
</style>
