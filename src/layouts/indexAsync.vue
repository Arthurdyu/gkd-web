<!-- 💥 这里是异步加载 LayoutComponents -->
<template>
  <suspense>
    <template #default>
      <component :is="LayoutComponents" />
    </template>
    <template #fallback>
      <Loading />
    </template>
  </suspense>
</template>

<script setup lang="ts" name="layoutAsync">
import { defineAsyncComponent, type Component } from "vue";
import Loading from "@/components/Loading/index.vue";

const LayoutComponents: Component = defineAsyncComponent(() => import("./LayoutTransverse/index.vue"));
</script>

<style scoped lang="scss">
.layout {
  min-width: 1440px;
}
</style>
