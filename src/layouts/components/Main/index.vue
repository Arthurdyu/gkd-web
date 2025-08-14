<template>
  <Maximize v-show="maximize" />
  <el-main>
    <router-view v-slot="{ Component, route }">
      <transition appear name="fade-transform" mode="out-in">
        <keep-alive :include="keepAliveName">
          <component :is="createComponentWrapper(Component, route)" v-if="isRouterShow" :key="route.fullPath" />
        </keep-alive>
      </transition>
    </router-view>
    <el-backtop :visibility-height="100" target="#app"></el-backtop>
    <Footer />
  </el-main>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, provide, watch, h, onActivated, onMounted, onDeactivated } from "vue";
import { storeToRefs } from "pinia";
import { useDebounceFn } from "@vueuse/core";
import { useGlobalStore } from "@/stores/modules/global";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import Maximize from "./components/Maximize.vue";
import Footer from "@/layouts/components/Footer/index.vue";

import { useRoute } from "vue-router";
const globalStore = useGlobalStore();
const { maximize, isCollapse, layout } = storeToRefs(globalStore);

const keepAliveStore = useKeepAliveStore();
const { keepAliveName } = storeToRefs(keepAliveStore);

// 注入刷新页面方法
const isRouterShow = ref(true);
const refreshCurrentPage = (val: boolean) => (isRouterShow.value = val);
provide("refresh", refreshCurrentPage);

// 解决详情页 keep-alive 问题
const wrapperMap = new Map();
function createComponentWrapper(component, route) {
  if (!component) return;
  const wrapperName = route.fullPath;
  let wrapper = wrapperMap.get(wrapperName);
  if (!wrapper) {
    // wrapper = { name: wrapperName, render: () => h(component) };
    wrapper = route.meta.isKeepAlive
      ? {
          name: wrapperName,
          setup() {
            const position = ref<number>(0);
            onActivated(() => {
              document.querySelector("#app")?.scrollTo(0, position.value);
            });
            onDeactivated(() => {
              position.value = document.querySelector("#app")?.scrollTop ?? 0;
            });
            return () => h(component);
          }
        }
      : {
          name: wrapperName,
          setup() {
            onMounted(() => {
              document.querySelector("#app")?.scrollTo(0, 0);
            });
            return () => h(component);
          }
        };
    wrapperMap.set(wrapperName, wrapper);
  }
  return h(wrapper);
}
//如果不使用Tabs组件 仍需要监听keepalive tabs
const router = useRoute();
watch(
  () => router.fullPath,
  () => {
    if (router.meta.isFull) return;
    const tabsParams = {
      icon: router.meta.icon as string,
      title: router.meta.title as string,
      path: router.fullPath,
      name: router.name as string,
      close: !router.meta.isAffix,
      isKeepAlive: router.meta.isKeepAlive as boolean
    };
    if (!keepAliveStore.keepAliveName.includes(tabsParams.name) && tabsParams.isKeepAlive) {
      keepAliveStore.addKeepAliveName(tabsParams.path);
    }
  },
  { immediate: true }
);

// 监听当前页面是否最大化，动态添加 class
watch(
  () => maximize.value,
  () => {
    const app = document.getElementById("app") as HTMLElement;
    if (maximize.value) app.classList.add("main-maximize");
    else app.classList.remove("main-maximize");
  },
  { immediate: true }
);

// 监听布局变化，在 body 上添加相对应的 layout class
watch(
  () => layout.value,
  () => {
    const body = document.body as HTMLElement;
    body.setAttribute("class", layout.value);
  },
  { immediate: true }
);

// 监听窗口大小变化，折叠侧边栏
const screenWidth = ref(0);
const listeningWindow = useDebounceFn(() => {
  screenWidth.value = document.body.clientWidth;
  if (!isCollapse.value && screenWidth.value < 1440) globalStore.setGlobalState("isCollapse", true);
  if (isCollapse.value && screenWidth.value > 1440) globalStore.setGlobalState("isCollapse", false);
}, 100);
window.addEventListener("resize", listeningWindow, false);
onBeforeUnmount(() => {
  window.removeEventListener("resize", listeningWindow);
});
</script>

<style scoped lang="scss">
@import "./index";
</style>
