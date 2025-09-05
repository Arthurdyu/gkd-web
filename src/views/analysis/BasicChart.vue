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
            <span>Database Data versus Database Data (infant gut microbiome)</span>
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

              <el-form-item label="Gender:">
                <el-select v-model="group.gender" placeholder="Select a gender" clearable style="width: 100%">
                  <el-option value="Male" label="Male" />
                  <el-option value="Female" label="Female" />
                  <el-option value="Unknown" label="Unknown" />
                </el-select>
              </el-form-item>

              <el-form-item label="Age (days):">
                <el-row :gutter="10">
                  <el-col :span="11">
                    <el-input-number v-model="group.ageFrom" placeholder="From" style="width: 100%" />
                  </el-col>
                  <el-col :span="2" class="text-center">-</el-col>
                  <el-col :span="11">
                    <el-input-number v-model="group.ageTo" placeholder="To" style="width: 100%" />
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <el-button type="primary" @click="compareGroups">Compare</el-button>

        <!-- 图表展示区域 -->
        <div class="chart-area">
          <el-divider><h3>Abundance Differences Between the 2 Groups</h3></el-divider>
          <div class="venn-diagram">
            <!-- Venn Diagram 图表插件 -->
            <el-empty description="Venn Diagram 插件占位符" />
          </div>

          <div class="bar-charts">
            <div class="chart-group">
              <el-divider><h4>Differential Genera in Group 1</h4></el-divider>
              <!-- Bar Chart 插件 -->
              <el-empty description="Bar Chart 插件占位符" />
            </div>
            <div class="chart-group">
              <el-divider><h4>Insignificantly Differential Genera</h4></el-divider>
              <!-- Bar Chart 插件 -->
              <el-empty description="Bar Chart 插件占位符" />
            </div>
            <div class="chart-group">
              <el-divider><h4>Differential Genera in Group 2</h4></el-divider>
              <!-- Bar Chart 插件 -->
              <el-empty description="Bar Chart 插件占位符" />
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 定义每个组的数据结构
interface Group {
  country: string;
  gender: string;
  delivery: string;
  gestation: string;
  ageFrom: number;
  ageTo: number;
  breastfeedingFrom: number;
  breastfeedingTo: number;
  includeUnknownBreastfeeding: boolean;
}

// 初始化两个组的数据
const groups = ref<Group[]>([
  {
    country: "",
    gender: "",
    delivery: "",
    gestation: "",
    ageFrom: 0,
    ageTo: 100,
    breastfeedingFrom: 0,
    breastfeedingTo: 180,
    includeUnknownBreastfeeding: false
  },
  {
    country: "",
    gender: "",
    delivery: "",
    gestation: "",
    ageFrom: 100,
    ageTo: 200,
    breastfeedingFrom: 0,
    breastfeedingTo: 180,
    includeUnknownBreastfeeding: false
  }
]);

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
