<template>
  <div class="filter-item">
    <label style="display: block; margin-bottom: 8px">{{ label }}:</label>
    <el-select
      :model-value="modelValue"
      multiple
      clearable
      filterable
      collapse-tags
      :placeholder="placeholder"
      popper-class="custom-header"
      :max-collapse-tags="1"
      style="width: 100%"
      @update:model-value="onUpdate"
    >
      <template #header>
        <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll"> All </el-checkbox>
      </template>
      <el-option v-for="item in safeOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { CheckboxValueType } from "element-plus"; // 新增导入

// 定义选项的类型
interface Option {
  label: string;
  value: string | number;
}

const props = defineProps({
  label: String,
  options: {
    type: Array as () => Option[],
    default: (): Option[] => []
  },
  modelValue: {
    type: Array as () => (string | number)[],
    default: (): (string | number)[] => []
  },
  placeholder: String
});

const emit = defineEmits(["update:modelValue"]);
const checkAll = ref(false);
const indeterminate = ref(false);

const safeOptions = computed(() => (Array.isArray(props.options) ? props.options : []));

watch(
  () => props.modelValue,
  val => {
    if (!val || val.length === 0) {
      indeterminate.value = false;
      checkAll.value = false;
    } else if (val.length === safeOptions.value.length) {
      indeterminate.value = false;
      checkAll.value = true;
    } else {
      indeterminate.value = true;
      checkAll.value = false;
    }
  }
);

const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false;
  if (val === true) {
    emit(
      "update:modelValue",
      safeOptions.value.map(item => item.value)
    );
  } else {
    emit("update:modelValue", []);
  }
};

const onUpdate = (val: any) => {
  emit("update:modelValue", val);
};
</script>

<style scoped>
.filter-item {
  margin-bottom: 16px;
}
</style>
