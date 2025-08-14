import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { useAuthStore } from "@/stores/modules/auth";
import { RouteRecordRaw } from "vue-router";
import { staticRouter, errorRouter } from "@/routers/modules/static-router";
import NProgress from "@/config/nprogress";

const modules = import.meta.glob("@/views/**/*.vue");
const mode = import.meta.env.VITE_ROUTER_MODE;

const routerMode = {
  hash: () => createWebHashHistory(),
  history: () => createWebHistory()
};

/**
 * @description 📚 路由参数配置简介
 * @param path ==> 路由菜单访问路径
 * @param name ==> 路由 name (对应页面组件 name, 可用作 KeepAlive 缓存标识 && 按钮权限筛选)
 * @param redirect ==> 路由重定向地址
 * @param component ==> 视图文件路径
 * @param meta ==> 路由菜单元信息
 * @param meta.icon ==> 菜单和面包屑对应的图标
 * @param meta.title ==> 路由标题 (用作 document.title || 菜单的名称)
 * @param meta.activeMenu ==> 当前路由为详情页时，需要高亮的菜单
 * @param meta.isLink ==> 路由外链时填写的访问地址
 * @param meta.isHide ==> 是否在菜单中隐藏 (通常列表详情页需要隐藏)
 * @param meta.isFull ==> 菜单是否全屏 (示例：数据大屏页面)
 * @param meta.isAffix ==> 菜单是否固定在标签页中 (首页通常是固定项)
 * @param meta.isKeepAlive ==> 当前路由是否缓存
 * */
const router = createRouter({
  history: routerMode[mode](),
  routes: [...staticRouter, ...errorRouter],
  strict: false,
  scrollBehavior: () => ({ left: 0, top: 0 })
});

/**
 * @description 路由拦截 beforeEach
 * */
router.beforeEach(async (to, from, next) => {
  const keepAliveStore = useKeepAliveStore();
  const authStore = useAuthStore();

  NProgress.start();
  if (from.meta.isKeepAlive && !from.matched?.at(-1)?.children.find(item => to.name === item.name)) {
    keepAliveStore.removeKeepAliveName(from.path as string);
  }
  if (!authStore.authMenuListGet.length) {
    await authStore.getAuthMenuList();

    authStore.flatMenuListGet.forEach(item => {
      if (item.component && typeof item.component == "string") {
        item.component = modules["/src/views" + item.component + ".vue"];
      }
      if (item.meta.isFull) {
        router.addRoute(item as unknown as RouteRecordRaw);
      } else {
        router.addRoute("layout", item as unknown as RouteRecordRaw);
      }
    });
    return next({ ...to, replace: true });
  }
  next();
});

/**
 * @description 路由跳转错误
 * */
router.onError(error => {
  NProgress.done();
  console.warn("路由错误", error);
});
/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {
  NProgress.done();
});

export default router;
