<template>
  <div ref="chartRef" style="width: 100%; height: 100%"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import * as echarts from "echarts";

const props = defineProps<{
  data: Array<{ year: number; value: number }>;
}>();

const chartRef = ref<HTMLDivElement>();

const renderChart = () => {
  if (!chartRef.value) return;
  const chart = echarts.init(chartRef.value);
  chart.setOption({
    title: { text: "每年分离量柱状图", left: "center" },
    tooltip: {},
    xAxis: {
      type: "category",
      data: props.data.map(item => item.year)
    },
    yAxis: {
      type: "value",
      name: "分离量"
    },
    series: [
      {
        type: "bar",
        data: props.data.map(item => item.value),
        itemStyle: { color: "#409EFF" }
      }
    ]
  });
};

onMounted(renderChart);
watch(() => props.data, renderChart, { deep: true });
</script>
