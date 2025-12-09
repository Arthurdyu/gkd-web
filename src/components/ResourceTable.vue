<template>
  <el-card>
    <div class="resource-table-header">
      <h2 v-if="title" class="table-title">{{ title }}</h2>
      <div class="toolbar">
        <!-- 导出按钮，保持状态不变 -->
        <el-button
          v-if="showExportButton && (selectedItems.length > 0 || (selectedItems.length === 0 && fetchAllDataFunction))"
          type="primary"
          @click="selectedItems.length > 0 ? exportToCSV() : exportAllToCSV()"
          size="large"
          :disabled="exportLoading"
          :loading="exportLoading"
        >
          {{ selectedItems.length > 0 ? `Export Selected (${selectedItems.length})` : "Export All" }}
        </el-button>
      </div>
    </div>
    <!-- 移除外层不必要的容器和样式 -->
    <div class="resource-table-wrapper">
      <el-table
        :data="tableData"
        :border="false"
        :stripe="true"
        :fit="true"
        :height="height"
        :default-sort="defaultSort"
        :style="tableStyle"
        :row-key="rowKey"
        @selection-change="onSelectionChange"
        @sort-change="onSortChange"
        style="width: 100%"
        ref="tableRef"
        show-overflow-tooltip
      >
        <!-- 遍历渲染表格列 -->
        <template v-for="col in reactiveColumns" :key="col.prop || col.type">
          <!-- 特殊列类型处理（选择列、序号列） -->
          <el-table-column v-if="col.type === 'selection' || col.type === 'index'" v-bind="col" />
          <!-- 普通数据列 -->
          <el-table-column
            v-else
            v-bind="col"
            :sortable="col.sortable !== undefined ? col.sortable : defaultSortable"
            :sort-orders="col.sortOrders || defaultSortOrders"
            :min-width="col.minWidth || defaultColMinWidth"
            :max-width="col.maxWidth || defaultColMaxWidth"
          >
            <!-- 自定义表头插槽 -->
            <template v-if="col.headerSlot" #header="scope">
              <slot :name="col.headerSlot" :column="scope.column" :prop="col.prop" />
            </template>

            <!-- 默认表头 -->
            <template v-else-if="col.searchable" #header>
              <div class="column-header">
                <div class="column-label">{{ col.label }}</div>
                <div class="column-search">
                  <slot
                    :name="col.prop + 'Search'"
                    :prop="col.prop"
                    :search-value="col.searchValue"
                    :on-search="() => handleSearch(col.prop)"
                  >
                    <el-input
                      v-model="col.searchValue"
                      :placeholder="'Search ' + col.label"
                      size="small"
                      clearable
                      @clear="() => handleSearch(col.prop)"
                      @keyup.enter="() => handleSearch(col.prop)"
                      @input="event => onInput(col.prop, event)"
                      @click.stop
                      @mousedown.stop
                    />
                  </slot>
                </div>
              </div>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <!-- 分页组件 -->
    <el-pagination
      v-if="pagination"
      :current-page="paginationCurrentPage"
      :page-size="paginationPageSize"
      :page-sizes="pagination.pageSizes || [10, 20, 50, 100]"
      :total="pagination.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="pagination-container"
    />
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive, PropType } from "vue";
import { onMounted } from "vue";
import { ElMessage } from "element-plus";

// 定义组件接收的属性
const props = defineProps({
  // 表格数据源
  tableData: { type: Array, required: true },
  // 列配置信息
  columns: { type: Array, required: true },
  // 表格高度
  height: { type: [String, Number], default: 600 },
  // 表格样式
  tableStyle: { type: Object, default: () => ({ width: "100%" }) },
  // 默认排序配置
  defaultSort: { type: Object as PropType<{ prop: string; order: "ascending" | "descending" }>, default: () => ({}) },
  // 分页配置
  pagination: { type: Object, default: null },
  // 默认是否可排序
  defaultSortable: { type: Boolean, default: false },
  // 默认排序顺序
  defaultSortOrders: { type: Array, default: () => ["ascending", "descending"] },
  // 默认列最小宽度
  defaultColMinWidth: { type: [String, Number], default: 120 },
  // 默认列最大宽度
  defaultColMaxWidth: { type: [String, Number], default: 200 },
  // 表格标题
  title: { type: String, default: "" },
  // 是否显示导出按钮
  showExportButton: { type: Boolean, default: true },
  // 获取所有数据的函数（用于全选时导出所有数据）
  fetchAllDataFunction: { type: Function, default: null },
  // 跨页选择的数据集合
  selectedAllPagesData: { type: Array, default: () => [] },
  // 用于标识每行数据唯一性的字段名
  idField: { type: String, default: "id" }, // 默认使用"id"字段作为唯一标识
  // row-key 直接传递给 el-table，优先级高于 idField
  rowKey: { type: [String, Function] as PropType<string | ((row: any) => string)>, default: "id" }
});

// 计算 rowKey，优先使用 props.rowKey
const rowKey = computed(() => props.rowKey || props.idField || "id");

const emit = defineEmits(["selectionChange", "sortChange", "search", "update:columns", "update:selectedAllPagesData"]);

// 表格引用
const tableRef = ref();

// 存储选中的项目（始终与 selectedAllPagesData 保持同步）
const selectedItems = ref<any[]>([]);

// 创建响应式的列配置副本
const reactiveColumns = ref<any[]>([]);

// 新增：导出按钮 loading 状态
const exportLoading = ref(false);

// 自动化排查：打印 tableData 和 columns
onMounted(() => {
  console.log("[ResourceTable] onMounted tableData:", props.tableData);
  console.log("[ResourceTable] onMounted columns:", props.columns);
});

watch(
  () => props.tableData,
  val => {
    console.log("[ResourceTable] tableData changed:", val);
  },
  { deep: true }
);

watch(
  () => props.columns,
  val => {
    console.log("[ResourceTable] columns changed:", val);
  },
  { deep: true }
);

// 初始化响应式列配置
const initializeReactiveColumns = () => {
  // 创建列配置的深拷贝并使其响应式
  reactiveColumns.value = props.columns.map((col: any) => {
    // 特别处理选择列，添加自定义的selectable函数和reserve-selection属性
    if (col.type === "selection") {
      return {
        ...col,
        reserveSelection: true // 保留选择状态
      };
    }

    // 为每个可搜索的列确保有 searchValue 属性
    if (col.searchable) {
      return reactive({
        ...col,
        searchValue: col.searchValue || ""
      });
    }
    return col;
  });
};

// 监听原始列配置变化，重新初始化响应式列配置
watch(() => props.columns, initializeReactiveColumns, { deep: true, immediate: true });

// 监听 reactiveColumns 的变化，确保搜索值的更新能被父组件感知
watch(
  reactiveColumns,
  () => {
    // 创建一个包含搜索值更新的列配置副本
    const updatedColumns = reactiveColumns.value.map(col => {
      if (col.searchable) {
        return {
          ...col,
          searchValue: col.searchValue
        };
      }
      return col;
    });

    // 通知父组件列配置已更新
    emit("update:columns", updatedColumns);
  },
  { deep: true }
);

// 表格选择项变化处理函数
function onSelectionChange(val: any[]) {
  // 判断是否为全选（当前页全部被选中）
  if (val.length === props.tableData.length && props.tableData.length > 0 && props.fetchAllDataFunction) {
    exportLoading.value = true;
    // 跨页全选，获取所有数据
    props
      .fetchAllDataFunction()
      .then((allData: any[]) => {
        selectedItems.value = allData;
        emit("update:selectedAllPagesData", allData);
        emit("selectionChange", allData);
        exportLoading.value = false;
      })
      .catch(error => {
        // 处理错误情况，确保loading状态被重置
        console.error("获取所有数据失败:", error);
        exportLoading.value = false;
      });
    // 保持当前选中状态，不清理selectedItems.value
  } else {
    selectedItems.value = val;
    emit("update:selectedAllPagesData", val);
    emit("selectionChange", val);
  }
}

// 表格排序变化处理函数
function onSortChange(sortInfo: { column: any; prop: string; order: string }) {
  emit("sortChange", sortInfo);
}

// 处理输入事件
function onInput(prop: string, event: any) {
  // 添加日志以便调试
  console.log("Input event triggered:", prop, new Date().toLocaleTimeString());
  // 更准确地获取输入值
  let inputValue = "";

  // 处理不同类型的事件对象
  if (typeof event === "string") {
    // 如果event直接是字符串值
    inputValue = event;
  } else if (event && event.target) {
    // 如果event是标准的输入事件对象
    inputValue = (event.target as HTMLInputElement).value || "";
  }

  console.log("Input value captured:", inputValue);
  emit("search", prop, inputValue);
}

// 处理搜索事件（立即触发）
function handleSearch(prop: string) {
  console.log("Search event triggered:", prop, new Date().toLocaleTimeString());
  emit("search", prop);
}

// 导出选中项到 CSV
function exportToCSV() {
  if (selectedItems.value.length === 0) {
    ElMessage.warning("请至少选择一项进行导出");
    return;
  }

  exportDataToCSV(selectedItems.value, "selected-data.csv");
}

// 导出所有数据到 CSV
async function exportAllToCSV() {
  if (!props.fetchAllDataFunction) {
    ElMessage.warning("未提供获取所有数据的函数");
    return;
  }

  try {
    // 传递 export 标记，避免被 axiosCancel 取消
    const allData = await props.fetchAllDataFunction({ export: true });
    if (allData.length === 0) {
      ElMessage.warning("没有数据可以导出");
      return;
    }
    exportDataToCSV(allData, "all-data.csv");
  } catch (error) {
    console.error("获取所有数据失败:", error);
    ElMessage.error("获取所有数据失败");
  }
}

// 将数据导出为 CSV 文件
function exportDataToCSV(data: any[], filename: string) {
  try {
    // 获取列标题（排除特殊列如 selection 和 index）
    const normalColumns = props.columns.filter((col: any) => col.type !== "selection" && col.type !== "index");

    // 创建 CSV 内容
    let csvContent = "";

    // 添加标题行
    const headers = normalColumns.map((col: any) => `"${col.label}"`).join(",");
    csvContent += headers + "\n";

    // 添加数据行
    data.forEach(item => {
      const row = normalColumns
        .map((col: any) => {
          const value = item[col.prop];
          // 处理特殊字符和空值
          if (value === null || value === undefined) {
            return '""';
          }
          // 转义引号并包装在引号中
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(",");
      csvContent += row + "\n";
    });

    // 创建并下载文件
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    ElMessage.success(`成功导出 ${data.length} 条数据`);
  } catch (error) {
    console.error("导出 CSV 失败:", error);
    ElMessage.error("导出失败，请重试");
  }
}

// 新增：用于分页的计算属性
const paginationCurrentPage = computed(() => props.pagination?.currentPage || 1);

const paginationPageSize = computed(() => props.pagination?.pageSize || 10);

const handleSizeChange = (val: number) => {
  if (props.pagination?.onSizeChange) {
    props.pagination.onSizeChange(val);
  }
};

const handleCurrentChange = (val: number) => {
  if (props.pagination?.onCurrentChange) {
    props.pagination.onCurrentChange(val);
  }
};
</script>

<style scoped>
.resource-table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.table-title {
  margin: 0;
  color: #ce0e1f;
}
.toolbar {
  flex-shrink: 0;
}

/* 新增包裹器用于横向滚动 */
.resource-table-wrapper {
  width: 100%;
  overflow-x: auto;
}

/* 确保表头和单元格内容不换行并在超出时显示省略号 */
:deep(.el-table__header th) {
  padding-top: 5px;
  padding-bottom: 10px;
  margin-top: 20px;
  overflow: hidden;
  color: black;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: #fae7e9;
}
:deep(.el-table__body td) {
  text-align: center;
}
:deep(.el-table__cell) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 调整表格样式以确保列宽合理 */
:deep(.el-table) {
  /* 禁用表格自动缩放，让列宽由min-width和max-width控制 */
  --el-table-cell-padding: 0;

  /* 移除固定宽度，允许表格自然扩展 */
  width: auto !important;
}

/* 表头搜索框样式 */
.column-header {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.column-label {
  margin-bottom: 8px;
  font-weight: bold;
}
.column-search {
  width: 100%;
  padding: 0 5px;
}
:deep(.column-search .el-input__wrapper) {
  padding: 2px 8px;
}
:deep(.column-search .el-input__inner) {
  height: 24px;
  font-size: 12px;
  line-height: 24px;
}

/* 增加排序触发区域与搜索框的距离 */
:deep(.el-table__header .el-table__column-filter-trigger) {
  margin-top: 8px;
}
:deep(.el-table__header .caret-wrapper) {
  margin-top: 8px;
}
</style>
