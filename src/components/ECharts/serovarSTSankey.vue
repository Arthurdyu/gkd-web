<template>
  <div ref="chartRef" style="width: 100%; height: 100%"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import * as echarts from "echarts";

// 桑基图数据格式示例
const props = defineProps<{
  data: {
    nodes: Array<{ name: string }>;
    links: Array<{ source: string; target: string; value: number }>;
  };
}>();

const chartRef = ref<HTMLDivElement>();

const renderChart = () => {
  if (!chartRef.value) return;
  const chart = echarts.init(chartRef.value);
  chart.setOption({
    title: { text: "血清型-ST型桑基图", left: "center" },
    tooltip: { trigger: "item" },
    series: [
      {
        type: "sankey",
        data: props.data.nodes,
        links: props.data.links,
        emphasis: { focus: "adjacency" },
        lineStyle: { color: "source", curveness: 0.5 }
      }
    ]
  });
};

onMounted(renderChart);
watch(() => props.data, renderChart, { deep: true });
</script>
