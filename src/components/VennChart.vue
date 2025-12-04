<template>
  <!-- 对应你原生 HTML 中的 <div id="main"></div>，直接使用该 ID 保持一致 -->
  <div id="main">
    <!-- vue-echarts 核心组件，绑定 ECharts 配置 -->
    <v-chart class="echarts-container" :option="vennOption" :auto-resize="true" />
  </div>
</template>

<script setup>
import { ref } from "vue";
// 引入 vue-echarts 组件和 ECharts 核心模块
import { VChart } from "vue-echarts";
// 按需引入 ECharts 所需模块（减少体积，对应原生配置中的功能）
import "echarts/lib/chart/venn"; // 韦恩图核心模块
import "echarts/lib/component/title"; // 标题组件
import "echarts/lib/component/tooltip"; // 提示框组件
import "echarts/lib/component/toolbox"; // 工具箱组件（mark、dataView 等）

// 韦恩图配置：完全复现你原生 JS 中的 myChart.setOption(...) 内容
const vennOption = ref({
  title: {
    text: "Access vs Consulting", // 主标题（与原生一致）
    subtext: "Of each data set" // 副标题（与原生一致）
  },
  tooltip: {
    trigger: "item",
    formatter: "{b}: {c}" // 提示框格式：“集合名: 数值”（与原生一致）
  },
  toolbox: {
    show: true,
    feature: {
      mark: { show: true }, // 标记工具
      dataView: { show: true, readOnly: false }, // 数据视图（可编辑）
      restore: { show: true }, // 重置
      saveAsImage: { show: true } // 保存为图片（与原生一致）
    }
  },
  calculable: false, // 关闭“可计算”交互（与原生一致）
  series: [
    {
      name: "Wayne FIG.", // 系列名称（与原生一致）
      type: "venn", // 图表类型：韦恩图（核心）
      itemStyle: {
        normal: {
          label: {
            show: true,
            textStyle: {
              fontFamily: "Arial, Verdana, sans-serif",
              fontSize: 16,
              fontStyle: "italic",
              fontWeight: "bolder" // 标签样式（与原生一致）
            }
          },
          labelLine: {
            show: false, // 隐藏标签连接线（与原生一致）
            length: 10,
            lineStyle: { width: 1, type: "solid" }
          }
        },
        emphasis: {
          color: "#cc99cc", //  hover 时填充色
          borderWidth: 3, //  hover 时边框宽度
          borderColor: "#996699" //  hover 时边框色（与原生一致）
        }
      },
      // 韦恩图数据：3 个集合（access、advisory、public）（与原生一致）
      data: [
        { value: 100, name: "access" },
        { value: 50, name: "advisory" },
        { value: 20, name: "public" }
      ]
    }
  ]
});
</script>

<style scoped>
/* 复用你提供的 CSS 样式，保持完全一致 */
body {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  color: #000000;
  background-color: #ffffff;
}
a:link,
a:visited {
  color: #4682b4;
}
a:hover {
  color: #4169e1;
}
#main {
  box-sizing: border-box; /* 新增：避免 padding 导致容器超出 1000px */
  width: 1000px;
  height: 600px;
  padding: 10px;
  border: 1px solid #cccccc;
}

/* 让 ECharts 图表填满 #main 容器 */
.echarts-container {
  width: 100%;
  height: 100%;
}
</style>
