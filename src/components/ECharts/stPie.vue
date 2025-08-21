<template>
  <div ref="chartRef" style="width: 100%; height: 100%"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import * as echarts from "echarts";

const props = defineProps<{
  data: Array<{ name: string; value: number }>;
}>();

const chartRef = ref<HTMLDivElement>();

const renderChart = () => {
  if (!chartRef.value) return;
  const chart = echarts.init(chartRef.value);
  chart.setOption({
    title: { text: "ST型分布饼图", left: "center" },
    tooltip: { trigger: "item" },
    legend: { bottom: 0 },
    series: [
      {
        type: "pie",
        radius: "60%",
        data: props.data,
        label: { formatter: "{b}: {d}%" }
      }
    ]
  });
};

onMounted(renderChart);
watch(() => props.data, renderChart, { deep: true });
</script>
