export interface MapInitialOptions {
  name: string;
  map: string;
  center: [number, number];
  zoom: number;
}

export const mapOption = {
  grid: {
    width: "100%",
    height: "100%",
    left: "0%",
    right: "0%",
    bottom: "0%",
    containLabel: true
  },
  // 提示框组件
  tooltip: {
    trigger: "item", // 触发类型, 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用
    formatter: function (val) {
      if (val.data == null) return "";
      return val.data.name + ": " + val.data.value;
    }
  },
  // 视觉映射组件
  visualMap: {
    bottom: 0,
    right: 0,
    text: ["最多", "最少"],
    realtime: false,
    calculable: true,
    color: ["#bf1600ff", "#ec7878ff"] //地图映射颜色范围
  },
  series: [
    {
      type: "map",
      name: "地图",
      map: "world",
      roam: true,
      center: [105, 36],
      // 图形上的文本标签
      label: {
        show: false // 是否显示对应地名
      },
      zoom: 1.63,
      scaleLimit: {
        min: 1
      },
      // 地图区域的多边形 图形样式
      itemStyle: {
        areaColor: "#e5e5e5",
        // 地图区域的颜色 如果设置了visualMap，areaColor属性将不起作用
        borderWidth: 0.5,
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderType: "solid"
      },
      // 高亮状态下的多边形和标签样式
      emphasis: {
        label: {
          show: true,
          color: "#fff"
        },
        itemStyle: {
          areaColor: "#0784FF" // 地图区域的颜色
        }
      },
      select: {
        disabled: true
      },
      // 地图系列中的数据内容数组 数组项可以为单个数值
      data: []
    }
  ]
};
