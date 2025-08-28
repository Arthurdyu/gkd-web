<template>
  <div class="basic-chart-container">
    <!-- 左侧：导航栏
    <div class="left-panel">
      <h3>Navigation</h3>
      <ul>
        <li><a href="#data-sources">Data Sources</a></li>
        <li><a href="#usage-tips">Usage Tips</a></li>
        <li><a href="#note">Note</a></li>
        <li><a href="#database-data">Database Data Comparison</a></li>
      </ul>
    </div> -->

    <!-- 右侧：主要内容 -->
    <div class="right-panel">
      <!-- 页面标题 -->
      <h1 id="microbiome-analysis">Basic Charts</h1>

      <!-- 数据源
      <div id="data-sources" class="data-sources">
        <h2>Data Sources:</h2>
        <button class="data-source-button">DB data vs. DB data</button>
        <p>DB data vs. Upload</p>
      </div> -->

      <!-- 使用提示 -->
      <div id="usage-tips" class="usage-tips">
        <h2>Usage Tips:</h2>
        <p>如果你想从数据库中比较两组的信息：</p>
        <ol>
          <li>设置您感兴趣的 2 个组的筛选器。</li>
          <li>点击 "Compare" 按钮来进行比较。</li>
        </ol>
      </div>

      <!-- 注意事项 -->
      <!-- <div id="note" class="note">
        <h2>Note:</h2>
        <ul>
          <li>进行绘图分析的所有数据都是基于我们的沙门菌数据库。</li>
        </ul>
      </div> -->

      <!-- 中间：数据对比区域 -->
      <div id="database-data" class="middle-panel">
        <h2>Database Data versus Database Data (infant gut microbiome)</h2>
        <div class="group-forms">
          <div class="group-form" v-for="(group, index) in groups" :key="index">
            <h3>Group {{ index + 1 }}</h3>
            <form>
              <label for="country">Country:</label>
              <select id="country" v-model="group.country">
                <option value="">Select a country</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <!-- 更多国家选项 -->
              </select>

              <label for="gender">Gender:</label>
              <select id="gender" v-model="group.gender">
                <option value="">Select a gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unknown">Unknown</option>
              </select>

              <label for="delivery">Delivery:</label>
              <select id="delivery" v-model="group.delivery">
                <option value="">Select delivery type</option>
                <option value="Vaginal">Vaginal</option>
                <option value="Cesarean">Cesarean</option>
              </select>

              <label for="gestation">Gestation:</label>
              <select id="gestation" v-model="group.gestation">
                <option value="">Select gestation</option>
                <option value="Full-term">Full-term</option>
                <option value="Preterm">Preterm</option>
              </select>

              <label for="age">Age (days):</label>
              <input type="number" id="age-from" v-model="group.ageFrom" placeholder="From" />
              <input type="number" id="age-to" v-model="group.ageTo" placeholder="To" />

              <label for="breastfeeding">Breastfeeding Duration (days):</label>
              <input type="number" id="breastfeeding-from" v-model="group.breastfeedingFrom" placeholder="From" />
              <input type="number" id="breastfeeding-to" v-model="group.breastfeedingTo" placeholder="To" />

              <label>
                <input type="checkbox" v-model="group.includeUnknownBreastfeeding" />
                including unknown breastfeeding duration samples
              </label>
            </form>
          </div>
        </div>
        <el-button type="primary" @click="compareGroups">Compare</el-button>

        <!-- 图表展示区域 -->
        <div class="chart-area">
          <h3>Abundance Differences Between the 2 Groups</h3>
          <div class="venn-diagram">
            <!-- Venn Diagram 图表插件 -->
          </div>

          <div class="bar-charts">
            <div class="chart-group">
              <h4>Differential Genera in Group 1</h4>
              <!-- Bar Chart 插件 -->
            </div>
            <div class="chart-group">
              <h4>Insignificantly Differential Genera</h4>
              <!-- Bar Chart 插件 -->
            </div>
            <div class="chart-group">
              <h4>Differential Genera in Group 2</h4>
              <!-- Bar Chart 插件 -->
            </div>
          </div>
        </div>
      </div>
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
