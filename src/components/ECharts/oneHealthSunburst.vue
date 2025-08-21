<template>
  <div ref="chartRef" style="width: 100%; height: 100%"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import * as echarts from "echarts";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  data?: any; // 可选，支持外部传递数据
}>();

const chartRef = ref<HTMLDivElement>();

// 四层旭日图数据示例
const defaultData = [
  {
    //name: "OneHealth",
    itemStyle: { color: "#ffffff" },
    children: [
      {
        name: "Human",
        itemStyle: { color: "#90BFF9" },
        children: [
          {
            name: "Clinical",

            itemStyle: { color: "#7FB3D5" },
            value: 10
          },
          {
            name: "non-Clinical",

            itemStyle: { color: "#A3D8F4" },
            value: 20
          }
        ]
      },
      {
        name: "Animal",
        itemStyle: { color: "#FF8080" },
        children: [
          {
            name: "Domestic Animal",
            itemStyle: { color: "#FFB6B6" },
            children: [
              { name: "Food Animal", value: 6, itemStyle: { color: "#FFD6D6" } },
              { name: "Sport Animal", value: 6, itemStyle: { color: "#FFD6D6" } }
            ]
          },
          {
            name: "Wild Animal",
            itemStyle: { color: "#FF9999" },
            value: 6
          }
        ]
      },
      {
        name: "Enviornment",
        itemStyle: { color: "#05BE78" },
        children: [
          {
            name: "Water",
            itemStyle: { color: "#A3E4D7" },
            value: 10
          },
          {
            name: "Soil",
            itemStyle: { color: "#A3E4D7" },
            value: 10
          },
          {
            name: "Plant Associated",
            itemStyle: { color: "#7DE2D1" },
            value: 10
          },
          {
            name: "Animal Associated",
            itemStyle: { color: "#A3E4D7" },
            value: 10
          },
          {
            name: "Food Associated",
            itemStyle: { color: "#A3E4D7" },
            value: 10
          }
        ]
      },
      {
        name: "Food",
        itemStyle: { color: "#F2B77C" },
        children: [
          {
            name: "Animal Origin",
            itemStyle: { color: "#F9E79F" },
            value: 10
          },
          {
            name: "Plant Origin",
            itemStyle: { color: "#F7DC6F" },
            value: 10
          },
          {
            name: "Feed(Aniaml Origin)",
            itemStyle: { color: "#F7DC6F" },
            value: 10
          },
          {
            name: "Feed(Plant Origin)",
            itemStyle: { color: "#F7DC6F" },
            value: 10
          }
        ]
      }
    ]
  }
];

/**
 * 渲染图表
 *
 * 该函数用于初始化 ECharts 实例并设置图表配置，渲染一个环形图。
 *
 * @returns 无返回值
 */
const renderChart = () => {
  if (!chartRef.value) return;
  const chart = echarts.init(chartRef.value);
  chart.setOption({
    title: { text: t("home.onehealth_sunburst"), left: "center" },
    series: [
      {
        type: "sunburst", // 指定图表类型为旭日图
        data: props.data || defaultData, // 图表数据，优先使用外部传入的数据
        radius: [0, "100%"], // 旭日图的内外半径，最大半径为容器的90%
        label: { rotate: "radial" } // 标签沿径向旋转，提升可读性
        // levels: [
        //   {}, // 第一层（中心），默认样式
        //   { r0: 0, r: 20, label: { fontSize: 10 } }, // 第二层，内半径20，外半径40，宽度加大，字体较大
        //   { r0: 20, r: 70, label: { fontSize: 10 } }, // 第三层，内半径8，外半径70，字体适中
        //   { r0: 70, r: 150, label: { fontSize: 10 } } // 第四层，内半径10，外半径90，字体较小
        // ]
      }
    ]
  });
};

onMounted(renderChart);
watch(() => props.data, renderChart, { deep: true });
</script>
