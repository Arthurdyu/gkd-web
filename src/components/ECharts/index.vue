<template>
  <div id="echarts" ref="chartRef" :style="echartsStyle" />
</template>

<script setup lang="ts" name="ECharts">
import { ref, onMounted, onBeforeUnmount, watch, computed, markRaw, nextTick } from "vue";
import { EChartsType, ECElementEvent } from "echarts/core";
import echarts, { ECOption, ECFunction } from "./config";
import { useDebounceFn } from "@vueuse/core";
import { useGlobalStore } from "@/stores/modules/global";
import { storeToRefs } from "pinia";
import { DEFAULT_PRIMARY } from "@/config";
import { isNumber } from "@/utils/is";
const loadingOption = {
  text: "加载中", // 加载提示文本
  color: DEFAULT_PRIMARY, // 加载图标颜色
  textColor: "#000", // 加载文本颜色
  maskColor: "rgba(255, 255, 255, 0.4)", // 遮罩层颜色
  zlevel: 1 // 图层级别
};
interface Props {
  option: ECOption;
  renderer?: "canvas" | "svg";
  resize?: boolean;
  theme?: Object | string;
  width?: number | string;
  height?: number | string;
  onClick?: (event: ECElementEvent) => any;
}

const props = withDefaults(defineProps<Props>(), {
  renderer: "canvas",
  resize: true,
  width: "100%",
  height: "100%"
});

const echartsStyle = computed(() => {
  return {
    height: isNumber(props.height) ? props.height + "px" : props.height,
    width: isNumber(props.width) ? props.width + "px" : props.width
  };
});

const chartRef = ref<HTMLDivElement | HTMLCanvasElement>();
const chartInstance = ref<EChartsType>();

const draw = () => {
  if (chartInstance.value) {
    chartInstance.value.setOption(props.option, { notMerge: true });
  }
};

watch(props, () => {
  draw();
});

const handleClick = (event: ECElementEvent) => props.onClick && props.onClick(event);

const init = () => {
  if (!chartRef.value) return;
  chartInstance.value = echarts.getInstanceByDom(chartRef.value);

  if (!chartInstance.value) {
    chartInstance.value = markRaw(
      echarts.init(chartRef.value, props.theme, {
        renderer: props.renderer
      })
    );
    chartInstance.value.on("click", handleClick);
    draw();
  }
};

const resize = () => {
  if (chartInstance.value && props.resize) {
    chartInstance.value.resize({ animation: { duration: 300 } });
  }
};

const debouncedResize = useDebounceFn(resize, 300, { maxWait: 800 });

const globalStore = useGlobalStore();
const { maximize, isCollapse, tabs, footer } = storeToRefs(globalStore);

watch(
  () => [maximize, isCollapse, tabs, footer],
  () => {
    debouncedResize();
  },
  { deep: true }
);

onMounted(() => {
  nextTick(() => init());
  window.addEventListener("resize", debouncedResize);
});

onBeforeUnmount(() => {
  chartInstance.value?.dispose();
  window.removeEventListener("resize", debouncedResize);
});

defineExpose({
  getOption: () => chartInstance.value?.getOption(),
  loading: () => chartInstance.value?.showLoading("default", loadingOption),
  cancelLoading: () => chartInstance.value?.hideLoading(),
  resize,
  draw
} as ECFunction);
</script>
