<!-- src/components/metaTable.vue -->
<template>
  <el-table :data="metalist" border stripe>
    <el-table-column type="index" label="序号" />
    <el-table-column prop="strain" label="菌株" />
    <el-table-column prop="subspecies" label="亚种" />
    <el-table-column prop="serovar" label="血清型" />
    <el-table-column prop="st" label="ST型" />
    <el-table-column prop="isolationSource" label="分离来源" />
    <el-table-column prop="host" label="宿主" />
    <el-table-column prop="collectionYear" label="采集年份" />
    <el-table-column prop="country" label="国家" />
    <el-table-column prop="oneHealth" label="OneHealth" />
    <el-table-column prop="onehealth2" label="OneHealth2" />
    <el-table-column prop="oneHealth3" label="OneHealth3" />
    <el-table-column prop="argNumber" label="耐药基因数" />
    <el-table-column prop="vfNumber" label="毒力基因数" />
    <el-table-column prop="invasive" label="侵袭指数" />
  </el-table>
</template>

<script setup lang="ts">
defineProps<{
  metalist: any[];
}>();
</script>

<style scoped></style>
