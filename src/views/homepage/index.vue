<template>
  <div class="homepage-contianer">
    <div class="part-one-container">
      <div class="part-one-content">
        <img class="bg-img" src="@/assets/images/home_p1_bg.png" />
        <div class="part-one-text-show">{{ $t("home.sub_title") }}</div>
        <div class="part-one-title">{{ $t("home.title") }}</div>
        <el-button round type="primary" size="large">{{ $t("home.show_bt") }}</el-button>
      </div>
    </div>
    <div class="part-two-container">
      <div class="part-two-content">
        <div class="part-two-title">
          {{ $t("home.db_intro") }}
        </div>
        <div class="part-two-text">
          {{ $t("home.onehealth_categorization") }}
        </div>
        <div class="chart-container">
          <div class="sunburst-img">
            <Echarts :option="summerChatOption" width="500px" height="500px" color="#ff0000"></Echarts>
          </div>
          <img class="onehealth-img" src="@/assets/images/OneHealth.svg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//导入旭日图组件，并获取数据接口
import { getSunburstApi } from "@/api/modules/homepage";
import Echarts from "@/components/ECharts/index.vue";
import { onMounted, ref } from "vue";

//import SerotypePieChart from "@/components/ECharts/serovarPie.vue";
const summerChatOption = ref<any>({});

// 1. 选择场景一：大肠杆菌血清型数据
// const eColiSerotypeData = [
//   { name: "O157:H7", value: 35 },
//   { name: "O121", value: 22 },
//   { name: "O26", value: 18 },
//   { name: "O111", value: 15 },
//   { name: "O45", value: 8 },
//   { name: "其他血清型", value: 2 }
// ];

const getSunburst = async () => {
  try {
    const params = {
      id: ""
    };
    const res = await getSunburstApi(params);
    const newList = [
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
                value: res.data.Human_Clinical
              },
              {
                name: "non-Clinical",

                itemStyle: { color: "#A3D8F4" },
                value: res.data["Human_Non_Clincal"]
              }
            ]
          },
          {
            name: "Animal",
            itemStyle: { color: "#FF8080" },
            value: res.data.Animal,
            children: [
              {
                name: "Domestic Animal",
                itemStyle: { color: "#FFB6B6" },
                value: res.data.Animal_Domestic_Animal,
                children: [
                  { name: "Food Animal", value: 33772, itemStyle: { color: "#FFD6D6" } }
                  // { name: "Sport Animal", value: 1000, itemStyle: { color: "#FFD6D6" } }
                ]
              },
              {
                name: "Wild Animal",
                itemStyle: { color: "#FF9999" },
                value: res.data.Animal_Wild_Animal
              }
            ]
          },
          {
            name: "Enviornment",
            itemStyle: { color: "#05BE78" },
            value: res.data.Environment,
            children: [
              {
                name: "Water",
                itemStyle: { color: "#A3E4D7" },
                value: res.data.Env_Water
              },
              {
                name: "Soil",
                itemStyle: { color: "#A3E4D7" },
                value: res.data.Env_Soil
              },
              {
                name: "Plant Associated",
                itemStyle: { color: "#7DE2D1" },
                value: res.data.Env_Plant_Associated
              },
              {
                name: "Animal Associated",
                itemStyle: { color: "#A3E4D7" },
                value: res.data.Env_Animal_Associated
              },
              {
                name: "Food Associated",
                itemStyle: { color: "#A3E4D7" },
                value: res.data.Env_Food_Associated
              }
            ]
          },
          {
            name: "Food",
            itemStyle: { color: "#F2B77C" },
            value: res.data.Food,
            children: [
              {
                name: "Animal Origin",
                itemStyle: { color: "#F9E79F" },
                value: res.data.Food_Animal_Origin
              },
              {
                name: "Plant Origin",
                itemStyle: { color: "#F7DC6F" },
                value: res.data.Food_Plant_Origin
              },
              {
                name: "Feed Aniaml Origin",
                itemStyle: { color: "#F7DC6F" },
                value: res.data.Food_feed_Animal_Origin
              },
              {
                name: "Feed Plant Origin",
                itemStyle: { color: "#F7DC6F" },
                value: res.data.Food_feed_Plant_Origin
              }
            ]
          }
        ]
      }
    ];
    summerChatOption.value = {
      series: {
        type: "sunburst",
        emphasis: {
          focus: "ancestor"
        },
        data: newList,
        radius: [0, "90%"],
        label: {
          rotate: "radial"
        }
      }
    };
    console.log(res);
  } catch (error) {}
};

onMounted(() => {
  getSunburst();
});
</script>

<style scoped lang="scss">
@import "./index";
</style>
