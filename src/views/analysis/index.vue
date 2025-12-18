<template>
  <div class="analysis-container">
    <!-- 左侧：侧边栏 -->
    <div class="side-nav">
      <ul>
        <li v-for="(item, index) in navItems" :key="index" @click="selectItem(index)" :class="{ active: activeIndex === index }">
          <el-card :class="{ 'active-card': activeIndex === index }">
            <img v-if="!item.icon.startsWith('fa')" :src="item.icon" class="local-icon" />
            <!-- Font Awesome用i标签 -->
            <i v-else :class="item.icon" class="font-icon"></i>
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
import BasicDraw from "./BasicDraw.vue";
import UploadDatasets from "./UploadDatasets.vue";
import GenoTrace from "./GenoTrace.vue";
import RiskAnalysis from "./RiskAnalysis.vue";

interface NavItem {
  icon: string;
  label: string;
}

//  导航数据
const navItems = ref<NavItem[]>([
  { label: "Basic Chart", icon: new URL("@/assets/images/icon/BasicChart.svg", import.meta.url).href },
  { label: "Upload Datasets", icon: new URL("@/assets/images/icon/Upload.svg", import.meta.url).href },
  { label: "GenoTrace", icon: new URL("@/assets/images/icon/GenoTrace.svg", import.meta.url).href },
  { label: "Risk Analysis", icon: new URL("@/assets/images/icon/RiskAnalysis.svg", import.meta.url).href }
]);

//  当前激活索引
const activeIndex = ref<number>(0);

//  点击处理
const selectItem = (index: number) => {
  activeIndex.value = index;
};

//  动态组件列表
const components = [BasicDraw, UploadDatasets, GenoTrace, RiskAnalysis] as const;

//  计算当前应显示的组件
const currentComponent = computed(() => {
  return components[activeIndex.value] || BasicDraw;
});
</script>

<style scoped lang="scss">
@import "./index";
</style>
