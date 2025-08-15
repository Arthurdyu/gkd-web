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
          <img class="onehealth-img" src="@/assets/images/OneHealth.svg" />
        </div>
      </div>
    </div>
    <div class="part-three-container">Visualization of Salmonella database</div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@import "./index";
</style>
