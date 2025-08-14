<template>
  <div class="map-echarts">
    <el-icon v-show="selectAreaCode" class="map-back" @click="onBack()">
      <ArrowLeft />
    </el-icon>
    <div id="echarts" ref="chartRef" :style="{ height: 'calc(100% - 16px )', width: '100%' }" />
    <div class="text">
      本地图数据来源于
      <a href="//lbs.amap.com/api/webservice/guide/api/district" target="_blank" rel="noreferrer">高德开放平台</a>
      ，该版本数据更新于2021.5，仅供学习交流使用。
    </div>
  </div>
</template>

<script setup lang="ts" name="MapECharts">
import { ref, onMounted, onBeforeUnmount, watch, markRaw, reactive } from "vue";
import { EChartsType, ECElementEvent } from "echarts/core";
import echarts, { ECOption } from "./config";
import { useDebounceFn } from "@vueuse/core";
import { DEFAULT_PRIMARY } from "@/config";
// import { useGlobalStore } from "@/stores/modules/global";
// import { storeToRefs } from "pinia";
import { codeTurnInfo, nameToCode, MapInitialOptions, mapOption } from "./helper";
import { ElMessage } from "element-plus";
import { mapJson } from "@/api/modules/homepage";
const loadingOption = {
  text: "加载中", // 加载提示文本
  color: DEFAULT_PRIMARY, // 加载图标颜色
  textColor: "#000", // 加载文本颜色
  maskColor: "rgba(255, 255, 255, 0.2)", // 遮罩层颜色
  zlevel: 1 // 图层级别
};
interface ChartMapProps {
  selectAreaCode: number;
  mapData: Array<{ name: string; value: number }> | [];
}
const props = withDefaults(defineProps<ChartMapProps>(), {
  selectAreaCode: 0,
  mapData: () => []
});

const emit = defineEmits<{
  "update:selectAreaCode": [value: number];
}>();
const chartRef = ref<HTMLDivElement | HTMLCanvasElement>();
const chartInstance = ref<EChartsType>();

const selectAreaItem = ref<MapInitialOptions>();
//已注册地图
const hasRegestList = reactive<Array<number>>([]);
const optionMap = reactive<ECOption>(mapOption as ECOption);

watch(
  () => props.mapData,
  () => {
    //获取地图信息 中心点 文件名
    selectAreaItem.value = codeTurnInfo(props.selectAreaCode);
    draw();
  },
  { deep: true }
);
function draw() {
  if (chartInstance.value && selectAreaItem.value) {
    //判断是否已经注册
    if (!hasRegestList.includes(props.selectAreaCode)) {
      hasRegestList.push(props.selectAreaCode);
      //注册地图
      mapJson(
        [310000, 110000, 120000, 500000].includes(props.selectAreaCode) ? props.selectAreaCode : props.selectAreaCode + "_full"
      )
        .then(jsonData => {
          echarts.registerMap(selectAreaItem.value!.map, jsonData.data as any);
        })
        .then(() => {
          setMapOptions();
        });
    } else {
      setMapOptions();
    }
  }
}
const setMapOptions = () => {
  const { map, center, zoom } = selectAreaItem.value!;
  optionMap.series![0] = { ...optionMap.series![0], map, center, zoom };
  optionMap.series![0].data = props.mapData ?? [];
  const sortMapData = props.mapData!.sort((a, b) => b.value - a.value) ?? [];
  optionMap.visualMap!["max"] = sortMapData.at(0)?.value ?? 200;
  optionMap.visualMap!["min"] = sortMapData.length > 1 ? sortMapData.at(-1)?.value : 0;
  chartInstance.value!.setOption(optionMap, { notMerge: true });
};
const onBack = () => {
  emit("update:selectAreaCode", 0);
};
const handleClick = (event: ECElementEvent) => {
  if (["台湾省", "香港特别行政区", "澳门特别行政区"].includes(event.name)) {
    ElMessage.error("暂无对应数据");
  } else if (event.name && nameToCode[event.name]) {
    emit("update:selectAreaCode", nameToCode[event.name]);
  }
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
    chartInstance.value.off("click");
    chartInstance.value.on("click", handleClick);
    draw();
  }
};

const resize = () => {
  if (chartInstance.value) {
    chartInstance.value.resize({ animation: { duration: 300 } });
  }
};

const debouncedResize = useDebounceFn(resize, 300, { maxWait: 800 });

// const globalStore = useGlobalStore();
// const { maximize, isCollapse, tabs, footer } = storeToRefs(globalStore);

// watch(
//   () => [maximize, isCollapse, tabs, footer],
//   () => {
//     debouncedResize();
//   },
//   { deep: true }
// );

onMounted(() => {
  //初始化空地图
  mapJson("100000_full")
    .then(jsonData => {
      selectAreaItem.value = codeTurnInfo(null);
      hasRegestList.push(0);
      echarts.registerMap("china", jsonData.data as any);
    })
    .then(() => {
      init();
      // nextTick(() => init());
    });
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
