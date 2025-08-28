<template>
  <div class="analysis-container">
    <!-- 左侧：侧边栏 -->
    <div class="side-nav">
      <ul>
        <li v-for="(item, index) in navItems" :key="index" @click="selectItem(index)" :class="{ active: activeIndex === index }">
          <el-card :class="{ 'active-card': activeIndex === index }">
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
          </el-card>
        </li>
      </ul>
    </div>

    <!-- 右侧：内容区域 -->
    <div class="content-area">
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

//  导入同目录下的页面组件
import BasicChart from "./BasicChart.vue";
import UploadDatasets from "./UploadDatasets.vue";
import GenoTrace from "./GenoTrace.vue";
import RiskAnalysis from "./RiskAnalysis.vue";

// declare module "*.vue" {
//   import { DefineComponent } from "vue";
//   const component: DefineComponent<{}, {}, any>;
//   export default component;
// }

interface NavItem {
  label: string;
  icon: string;
}

//  导航数据
const navItems = ref<NavItem[]>([
  { label: "Basic Chart", icon: "fas fa-chart-bar" },
  { label: "Upload Datasets", icon: "fas fa-upload" },
  { label: "GenoTrace", icon: "fas fa-dna" },
  { label: "Risk Analysis", icon: "fas fa-exclamation-triangle" }
]);

//  当前激活索引
const activeIndex = ref<number>(0);

//  点击处理
const selectItem = (index: number) => {
  activeIndex.value = index;
};

//  动态组件列表
const components = [BasicChart, UploadDatasets, GenoTrace, RiskAnalysis] as const;

//  计算当前应显示的组件
const currentComponent = computed(() => {
  return components[activeIndex.value] || BasicChart;
});
</script>

<style scoped lang="scss">
@import "./index";
</style>
