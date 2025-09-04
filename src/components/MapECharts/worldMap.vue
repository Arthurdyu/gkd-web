<template>
  <div class="map-echarts">
    <div id="echarts" ref="chartRef" :style="{ height: 'calc(100% - 16px )', width: '100%' }" />
    <div class="text"></div>
  </div>
</template>

<script setup lang="ts" name="MapECharts">
import { ref, onMounted, onBeforeUnmount, watch, markRaw, reactive } from "vue";
import { EChartsType } from "echarts/core";
import echarts, { ECOption } from "./config";
import { useDebounceFn } from "@vueuse/core";
import { DEFAULT_PRIMARY } from "@/config";
import { mapOption } from "./helper";
import worldJson from "@/assets/json/geo/world.json"; // 新增：引入世界地图数据

const loadingOption = {
  text: "加载中", // 加载提示文本
  color: DEFAULT_PRIMARY, // 加载图标颜色
  textColor: "#000", // 加载文本颜色
  maskColor: "rgba(255, 255, 255, 0.2)", // 遮罩层颜色
  zlevel: 1 // 图层级别
};
interface ChartMapProps {
  mapData: Array<{ name: string; value: number }> | [];
}
const props = withDefaults(defineProps<ChartMapProps>(), {
  mapData: () => []
});

const chartRef = ref<HTMLDivElement | HTMLCanvasElement>();
const chartInstance = ref<EChartsType>();
const optionMap = reactive<ECOption>(mapOption as ECOption);

watch(
  () => props.mapData,
  () => {
    //获取地图信息 中心点 文件名
    draw();
  },
  { deep: true }
);
function draw() {
  if (chartInstance.value) {
    // 判断是否已经注册
    // 设置地图选项
    setMapOptions();
  }
}
const setMapOptions = () => {
  optionMap.series![0] = { ...optionMap.series![0], zoom: 1.2 }; // map 改为 world
  optionMap.series![0].data = props.mapData ?? [];
  const sortMapData = props.mapData!.sort((a, b) => b.value - a.value) ?? [];
  optionMap.visualMap!["max"] = sortMapData.at(0)?.value ?? 200;
  optionMap.visualMap!["min"] = sortMapData.length > 1 ? sortMapData.at(-1)?.value : 0;
  optionMap.series![0].itemStyle = {
    areaColor: "#e8e8e8", // 默认区域颜色
    borderColor: "gray", // 边界线颜色
    emphasis: {
      areaColor: "#ffd700" // 鼠标悬停时颜色
    }
  };
  chartInstance.value!.setOption(optionMap, { notMerge: true });
};
const init = () => {
  if (!chartRef.value) return;
  chartInstance.value = echarts.getInstanceByDom(chartRef.value);
  if (!chartInstance.value) {
    chartInstance.value = markRaw(
      echarts.init(chartRef.value, null, {
        renderer: "canvas"
      })
    );
    draw();
  }
};

const resize = () => {
  if (chartInstance.value) {
    chartInstance.value.resize({ animation: { duration: 300 } });
  }
};

const debouncedResize = useDebounceFn(resize, 300, { maxWait: 800 });
onMounted(() => {
  echarts.registerMap("world", worldJson as any); // 注册世界地图
  init();
  window.addEventListener("resize", debouncedResize);
});

onBeforeUnmount(() => {
  chartInstance.value?.dispose();
  window.removeEventListener("resize", debouncedResize);
});

defineExpose({
  loading: () => chartInstance.value?.showLoading("default", loadingOption),
  cancelLoading: () => chartInstance.value?.hideLoading()
});
</script>
<style scoped lang="scss">
.map-echarts {
  position: relative;
  width: 100%;
  height: 100%;
  .map-back {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 36px;
    height: 36px;
    font-size: 18px;
    cursor: pointer;
    background-color: white;
    border-radius: 50%;
    box-shadow: 0 3px 14px 2px #0000000d;
  }
}
.text {
  font-size: 12px;
  line-height: 16px;
  color: rgb(111 113 115 / 60%);
}
</style>
