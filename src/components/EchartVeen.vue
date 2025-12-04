<template>
  <!-- 容器必须设置宽高，否则图表无法渲染 -->
  <div ref="chartRef" class="venn-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";

const chartRef = ref(null);
let myChart = null;

onMounted(() => {
  if (!chartRef.value) return;
  myChart = echarts.init(chartRef.value);

  const option = {
    title: {
      text: "Access vs Consulting",
      subtext: "Of each data set"
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}"
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    series: [
      {
        name: "Wayne FIG.",
        type: "venn",
        itemStyle: {
          normal: {
            label: {
              show: true,
              fontFamily: "Arial, Verdana, sans-serif",
              fontSize: 16,
              fontStyle: "italic",
              fontWeight: "bolder"
            },
            labelLine: {
              show: false,
              length: 10,
              lineStyle: {
                width: 1,
                type: "solid"
              }
            }
          },
          emphasis: {
            color: "#cc99cc",
            borderWidth: 3,
            borderColor: "#996699"
          }
        },
        data: [
          { value: 100, name: "access" },
          { value: 50, name: "advisory" },
          { value: 20, name: "public" }
        ]
      }
    ]
  };

  myChart.setOption(option);
  window.addEventListener("resize", () => myChart.resize());
});

onUnmounted(() => {
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
});
</script>

<style scoped>
.venn-container {
  width: 1000px;
  height: 500px;
  padding: 10px;
  border: 1px solid #cccccc;
}
</style>
