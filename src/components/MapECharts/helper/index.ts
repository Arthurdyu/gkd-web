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
      console.log(val.data);
      if (val.data == null) return "";
      return val.data.text + val.data.name + ": " + val.data.value;
    }
  },
  // 视觉映射组件,地图的图例颜色映射
  visualMap: {
    type: "piecewise",
    bottom: 0, // 可以根据需要调整底部距离
    right: 200, // 可以根据需要调整右侧距离
    orient: "horizontal", // 设置为水平方向排列
    realtime: false,
    calculable: true,
    pieces: [
      { min: 100000, color: "#760202ff", label: "≥100,000" },
      { min: 10000, max: 99999, color: "#bf1600ff", label: "≥10,000" },
      { min: 1000, max: 9999, color: "#d45049ff", label: "≥1000" },
      { min: 100, max: 999, color: "#ea8f8fff", label: "≥100" },
      { min: 1, max: 99, color: "#f9c0a8ff", label: "1-99" }
      //{ value: 0, color: "#f0e9e9", label: "0" }
    ]
  },

  series: [
    {
      type: "map",
      name: "地图",
      map: "world",
      roam: true,
      center: [16, 16], //修改初始化中心位置
      // 图形上的文本标签
      label: {
        show: false // 是否显示对应地名
      },
      zoom: 1.63, // 地图的缩放比例
      scaleLimit: {
        min: 0.5
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
