export interface MapInitialOptions {
  name: string;
  map: string;
  center: [number, number];
  zoom: number;
}
const codeToNameMap = new Map<number, MapInitialOptions>([
  [
    110000,
    {
      name: "北京市",
      map: "Beijing",
      center: [116.405285, 40.25],
      zoom: 1
    }
  ],
  [
    120000,
    {
      name: "天津市",
      map: "Tianjin",
      center: [117.3, 39.4],
      zoom: 1.1
    }
  ],
  [
    130000,
    {
      name: "河北省",
      map: "Hebei",
      center: [116.1, 39.2],
      zoom: 1.2
    }
  ],
  [
    140000,
    {
      name: "山西省",
      map: "Shanxi",
      center: [112.549248, 37.857014],
      zoom: 1.15
    }
  ],
  [
    150000,
    {
      name: "内蒙古自治区",
      map: "InnerMongolia",
      center: [111.2, 44.5],
      zoom: 1.1
    }
  ],
  [
    210000,
    {
      name: "辽宁省",
      map: "Liaoning",
      center: [122.8, 41.1],
      zoom: 1.12
    }
  ],
  [
    220000,
    {
      name: "吉林省",
      map: "Jilin",
      center: [126.3, 43.6],
      zoom: 1.1
    }
  ],
  [
    230000,
    {
      name: "黑龙江省",
      map: "Heilongjiang",
      center: [127, 48.5],
      zoom: 1.1
    }
  ],
  [
    310000,
    {
      name: "上海市",
      map: "Shanghai",
      center: [121.472644, 31.231706],
      zoom: 1.12
    }
  ],
  [
    320000,
    {
      name: "江苏省",
      map: "Jiangsu",
      center: [119.3, 33],
      zoom: 1.1
    }
  ],
  [
    330000,
    {
      name: "浙江省",
      map: "Zhejiang",
      center: [120.153576, 29.2],
      zoom: 1.1
    }
  ],
  [
    340000,
    {
      name: "安徽省",
      map: "Anhui",
      center: [117.283042, 32],
      zoom: 1.1
    }
  ],
  [
    350000,
    {
      name: "福建省",
      map: "Fujian",
      center: [118.6, 26],
      zoom: 1.1
    }
  ],
  [
    360000,
    {
      name: "江西省",
      map: "Jiangxi",
      center: [115.892151, 27.3],
      zoom: 1.15
    }
  ],
  [
    370000,
    {
      name: "山东省",
      map: "Shandong",
      center: [118.8, 36.2],
      zoom: 1.1
    }
  ],
  [
    410000,
    {
      name: "河南省",
      map: "Henan",
      center: [113.2, 34],
      zoom: 1.15
    }
  ],
  [
    420000,
    {
      name: "湖北省",
      map: "Hubei",
      center: [112.5, 31.2],
      zoom: 1.1
    }
  ],
  [
    430000,
    {
      name: "湖南省",
      map: "Hunan",
      center: [112.2, 27.5],
      zoom: 1.1
    }
  ],
  [
    440000,
    {
      name: "广东省",
      map: "Guangdong",
      center: [113.1, 22.8],
      zoom: 1.1
    }
  ],
  [
    450000,
    {
      name: "广西壮族自治区",
      map: "Guangxi",
      center: [108.320004, 23.5],
      zoom: 1.1
    }
  ],
  [
    460000,
    {
      name: "海南省",
      map: "Hainan",
      center: [111, 12],
      zoom: 1.15
    }
  ],
  [
    500000,
    {
      name: "重庆市",
      map: "Chongqing",
      center: [107.5, 30.2],
      zoom: 1.2
    }
  ],
  [
    510000,
    {
      name: "四川省",
      map: "Sichuan",
      center: [103, 30],
      zoom: 1.15
    }
  ],
  [
    520000,
    {
      name: "贵州省",
      map: "Guizhou",
      center: [106.4, 26.9],
      zoom: 1.15
    }
  ],
  [
    530000,
    {
      name: "云南省",
      map: "Yunnan",
      center: [102.712251, 25.2],
      zoom: 1.15
    }
  ],
  [
    540000,
    {
      name: "西藏自治区",
      map: "Tibet",
      center: [89.8, 31.5],
      zoom: 1.1
    }
  ],
  [
    610000,
    {
      name: "陕西省",
      map: "Shaanxi",
      center: [109.5, 35.5],
      zoom: 1.18
    }
  ],
  [
    620000,
    {
      name: "甘肃省",
      map: "Gansu",
      center: [101.5, 37.7],
      zoom: 1.1
    }
  ],
  [
    630000,
    {
      name: "青海省",
      map: "Qinghai",
      center: [95.8, 36],
      zoom: 1.1
    }
  ],
  [
    640000,
    {
      name: "宁夏回族自治区",
      map: "Ningxia",
      center: [106.278179, 37.4],
      zoom: 1.15
    }
  ],
  [
    650000,
    {
      name: "新疆维吾尔自治区",
      map: "Xinjiang",
      center: [86.2, 42.3],
      zoom: 1.1
    }
  ],
  [
    710000,
    {
      name: "台湾省",
      map: "Taiwan",
      center: [121.509062, 25.044332],
      zoom: 0.5
    }
  ],
  [
    810000,
    {
      name: "香港特别行政区",
      map: "HongKong",
      center: [114.173355, 22.320048],
      zoom: 1
    }
  ],
  [
    820000,
    {
      name: "澳门特别行政区",
      map: "Macau",
      center: [113.54909, 22.198951],
      zoom: 1
    }
  ]
]);
export const codeTurnInfo = (code: number | null): MapInitialOptions => {
  if (code && codeToNameMap.has(code)) {
    return codeToNameMap.get(code)!;
  }
  return {
    name: "全国",
    map: "china",
    center: [105, 36],
    zoom: 1.63
  };
};

export const nameToCode = {
  北京市: 110000,
  天津市: 120000,
  河北省: 130000,
  山西省: 140000,
  内蒙古自治区: 150000,
  辽宁省: 210000,
  吉林省: 220000,
  黑龙江省: 230000,
  上海市: 310000,
  江苏省: 320000,
  浙江省: 330000,
  安徽省: 340000,
  福建省: 350000,
  江西省: 360000,
  山东省: 370000,
  河南省: 410000,
  湖北省: 420000,
  湖南省: 430000,
  广东省: 440000,
  广西壮族自治区: 450000,
  海南省: 460000,
  重庆市: 500000,
  四川省: 510000,
  贵州省: 520000,
  云南省: 530000,
  西藏自治区: 540000,
  陕西省: 610000,
  甘肃省: 620000,
  青海省: 630000,
  宁夏回族自治区: 640000,
  新疆维吾尔自治区: 650000
  // 台湾省: 710000,
  // 香港特别行政区: 810000,
  // 澳门特别行政区: 820000
};

export const nameToList = [{ label: "全国", value: 0 }].concat(
  Object.entries(nameToCode)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => {
      return a.label.localeCompare(b.label, "zh");
    })
);

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
    color: ["#004DBF", "#AED8FF"]
  },
  series: [
    {
      type: "map",
      name: "地图",
      map: "china",
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
