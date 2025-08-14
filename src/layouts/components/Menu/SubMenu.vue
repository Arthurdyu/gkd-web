<template>
  <template v-for="subItem in menuList" :key="subItem.path">
    <el-sub-menu
      v-if="subItem.children?.length"
      :index="subItem.path"
      :expand-close-icon="renderExpandIcon"
      :expand-open-icon="renderCollapseIcon"
    >
      <template #title>
        <i v-if="subItem.meta.icon" :class="['iconfont', subItem.meta.icon]"></i>
        <span class="sle">{{ $t(subItem.meta.title) }}</span>
      </template>
      <SubMenu :menu-list="subItem.children" />
    </el-sub-menu>
    <el-menu-item v-else :index="subItem.path" @click="handleClickMenu(subItem)">
      <i v-if="subItem.meta.icon" :class="['iconfont', subItem.meta.icon]"></i>
      <template #title>
        <span class="sle">{{ $t(subItem.meta.title) }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="tsx">
import { useRouter } from "vue-router";

defineProps<{ menuList: Menu.MenuOptions[] }>();
const router = useRouter();
const handleClickMenu = (subItem: Menu.MenuOptions) => {
  if (subItem.meta.isLink) return window.open(subItem.meta.isLink, "_blank");
  router.push(subItem.path);
};
// 折叠图标渲染函数
function renderCollapseIcon() {
  return <i class="iconfont icon-up" style="margin-right: 0"></i>;
}

// 展开图标渲染函数
function renderExpandIcon() {
  return <i class="iconfont icon-down" style="margin-right: 0"></i>;
}
</script>

<style lang="scss">
.el-popper.my-menu-popper {
  margin-left: 10px;
  border-radius: 8px !important;
}
.el-menu--popup {
  padding: 0;
  border-radius: 8px !important;
  .el-menu-item {
    &:first-child {
      border-radius: 8px 8px 0 0;
    }
    &:last-child {
      border-radius: 0 0 8px 8px;
    }
  }
}
.el-sub-menu .el-sub-menu__title:hover {
  // color: var(--el-menu-hover-text-color) !important;
  background-color: transparent !important;
}
.el-menu--collapse {
  .is-active {
    .el-sub-menu__title {
      color: #ffffff !important;
      background-color: var(--el-color-primary) !important;
    }
  }
}
.el-menu--vertical:not(.el-menu--collapse) {
  .is-active {
    .el-sub-menu__title {
      color: var(--el-menu-active-color) !important;
    }
  }
}
.el-menu-item {
  &:hover {
    color: var(--el-menu-hover-text-color);
  }
  &.is-active {
    color: var(--el-menu-active-color) !important;
    background-color: var(--el-menu-active-bg-color) !important;
  }
}
.el-menu:not(.el-menu--collapse) .el-sub-menu__title {
  padding-right: 20px;
}
.el-sub-menu .iconfont,
.el-menu-item .iconfont {
  width: 16px;
  margin-right: 12px;
  font-size: 16px;
}
.el-sub-menu .el-sub-menu__icon-arrow {
  width: 16px;
  height: 16px;
  margin-top: -8px;
  font-size: 16px;
  color: var(--el-menu-text-color);
}
.vertical,
.classic,
.transverse {
  .el-menu-item {
    &.is-active {
      &::before {
        right: 0;
      }
    }
  }
}
.columns {
  .el-menu-item {
    &.is-active {
      &::before {
        left: 0;
      }
    }
  }
}
</style>
