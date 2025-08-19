<template>
  <div class="resource-container">
    <div class="resource-map">
      <!-- 地图,显示基因组序列的地理分布。需要有筛选栏，根据 serovar，ST，country,Collection Year 等字段筛选序列-->
      <MapECharts>地图</MapECharts>
    </div>
    <div class="resource-chart-container">
      <div class="resource-chart-sequence-year">每年分离量柱状图</div>
      <div class="resource-chart-sankey">血清型-ST型桑基图</div>
      <div class="resource-chart-serovar">血清型饼图</div>
      <div class="resource-chart-st">ST型饼图</div>
    </div>

    <div class="resource-table-container">
      <div class="el-table__body-wrapper"></div>

      <!-- 表格，显示基因组序列信息，需要有筛选栏，根据 serovar，ST，country,Collection Year 等字段筛选序列 -->
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@import "./index";
</style>
