<template>
  <div class="basic-chart-container">
    <!-- 右侧：主要内容 -->
    <div class="right-panel">
      <!-- 页面标题 -->
      <el-page-header>
        <template #content>
          <span class="title"><h1>Basic Charts</h1></span>
        </template>
      </el-page-header>

      <!-- 使用提示 -->
      <el-card id="usage-tips" class="usage-tips">
        <template #header>
          <div class="card-header">
            <h2>Usage Tips:</h2>
            <p>如果你想从数据库中比较两组的信息：</p>
            <p>设置您感兴趣的 2 个组的筛选器</p>
            <p>点击 'Compare' 按钮来进行比较</p>
          </div>
        </template>
      </el-card>

      <!-- 中间：数据对比区域 -->
      <el-card id="database-data" class="middle-panel">
        <template #header>
          <div class="card-header">
            <span>Database Data </span>
          </div>
        </template>
        <div class="group-forms">
          <div class="group-form" v-for="(group, index) in groups" :key="index">
            <el-divider>
              <h3>Group {{ index + 1 }}</h3>
            </el-divider>
            <el-form label-position="top">
              <el-form-item label="Country:">
                <el-select v-model="group.country" placeholder="Select a country" clearable style="width: 100%">
                  <el-option value="US" label="United States" />
                  <el-option value="UK" label="United Kingdom" />
                  <!-- 更多国家选项 -->
                </el-select>
              </el-form-item>

              <el-form-item label="Serovar:">
                <el-select v-model="group.serovar" placeholder="Select a Serovar" clearable style="width: 100%">
                  <el-option value="All" label="All" />
                  <el-option value="Typhimurium" label="Typhimurium" />
                  <el-option value="Enteritidis" label="Enteritidis" />
                </el-select>
              </el-form-item>

              <el-form-item label="One Health:"></el-form-item>
              <el-select v-model="group.oneHealth" placeholder="Select delivery mode" clearable style="width: 100%">
                <el-option value="Vaginal" label="Vaginal" />
                <el-option value="C-Section" label="C-Section" />
                <el-option value="Unknown" label="Unknown" />
              </el-select>
            </el-form>
          </div>
        </div>
        <el-button type="primary" @click="compareGroups">Compare</el-button>

        <!-- 图表展示区域 -->
        <div class="chart-area">
          <!-- 选项卡组件 -->
          <el-tabs v-model="activeTab" class="tabs">
            <el-tab-pane label="Abundance" name="abundance">
              <p>Abundance 相关内容（可替换为对应图表等）</p>
            </el-tab-pane>
            <el-tab-pane label="Prevalence" name="prevalence">
              <!-- 布局行，用于并列展示两个图表 -->
              <el-row :gutter="20">
                <el-col :span="12">
                  <div ref="group1Chart" class="chart-container"></div>
                </el-col>
                <el-col :span="12">
                  <div ref="group2Chart" class="chart-container"></div>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="Diversity" name="diversity">
              <p>Diversity 相关内容</p>
            </el-tab-pane>
            <el-tab-pane label="Network" name="network">
              <p>Network 相关内容</p>
            </el-tab-pane>
            <el-tab-pane label="Biomarker" name="biomarker">
              <p>Biomarker 相关内容</p>
            </el-tab-pane>
            <el-tab-pane label="Function" name="function">
              <p>Function 相关内容</p>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
//import VennChart from "@/components/vennChart.vue";
//import EchartsVenn from "@/components/EchartVeen.vue";

// 定义每个组的数据结构
interface Group {
  country: string;
  serovar?: string;
  oneHealth?: string;
}

// 初始化两个组的数据
const groups = ref<Group[]>([
  {
    country: "",
    serovar: "",
    oneHealth: ""
  },
  {
    country: "",
    serovar: "",
    oneHealth: ""
  }
]);

// 选项卡活动状态
const activeTab = ref("abundance"); // 默认选中 "abundance" 选项卡

// 处理比较按钮点击事件
const compareGroups = () => {
  // 这里可以添加实际的比较逻辑
  console.log("Comparing groups:", groups.value);
};
</script>

<style scoped>
.basic-chart-container {
  display: flex;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}
.left-panel {
  width: 20%;
  padding: 15px;
  margin-right: 20px;
  background: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}
.right-panel {
  flex: 1;
}
.data-sources,
.usage-tips,
.note {
  padding: 15px;
  margin-bottom: 15px;
  background: #f9f9f9;
}
.group-forms {
  display: flex;
  justify-content: space-between;
}
.group-form {
  width: 48%;
  padding: 15px;
  margin-bottom: 15px;
  background: #ffffff;
  border: 1px solid #dddddd;
}
.chart-area {
  margin-top: 20px;
}
.venn-diagram,
.bar-charts {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
}
.bar-charts .chart-group {
  width: 32%;
  margin: 0 1%;
}
</style>
