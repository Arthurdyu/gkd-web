import { defineStore } from "pinia";
import { AuthState } from "@/stores/interface";
import { getFlatMenuList, getShowMenuList, getAllBreadcrumbList, getFirstLeafRoute } from "@/routers/utils";
import { HOME_URL } from "@/config";
import { allRouter } from "@/routers/modules/router-list";
export const useAuthStore = defineStore({
  id: "UCAS-auth",
  state: (): AuthState => ({
    // 按钮权限列表
    authButtonList: {},
    // 菜单权限列表
    authMenuList: [],
    // 当前页面的 router name，用来做按钮权限筛选
    routeName: "",
    // 首页
    homeRoute: HOME_URL
  }),
  getters: {
    // 按钮权限列表
    authButtonListGet: state => state.authButtonList,
    // 菜单权限列表 ==> 这里的菜单没有经过任何处理
    authMenuListGet: state => state.authMenuList,
    // 菜单权限列表 ==> 左侧菜单栏渲染，需要剔除 isHide == true
    showMenuListGet: state => getShowMenuList(state.authMenuList),
    // 菜单权限列表 ==> 扁平化之后的一维数组菜单，主要用来添加动态路由
    flatMenuListGet: state => getFlatMenuList(state.authMenuList),
    // 递归处理后的所有面包屑导航列表
    breadcrumbListGet: state => getAllBreadcrumbList(state.authMenuList),
    // 获取首页path
    getHomeRoute: state => state.homeRoute
  },
  actions: {
    // Set RouteName
    async setRouteName(name: string) {
      this.routeName = name;
    },
    // Get AuthMenuList
    async getAuthMenuList() {
      const newRouter = JSON.parse(JSON.stringify(allRouter));
      console.log(newRouter)
      this.authMenuList = newRouter;
      // 设置首页
      const newPath = getFirstLeafRoute(newRouter);
      localStorage.setItem("homeRoute", newPath ?? HOME_URL);
      this.homeRoute = newPath ?? HOME_URL;
    }
  }
});
