<!-- 💥 这里是一次性加载 LayoutComponents -->
<template>
  <component :is="LayoutTransverse" />
  <!-- <AiChat></AiChat> -->
</template>

<script setup lang="ts" name="layout">
import LayoutTransverse from "./LayoutTransverse/index.vue";
// import AiChat from "@/components/AiChat/index.vue";
</script>

<style scoped lang="scss">
.layout {
  min-width: 1440px;
}
</style>
