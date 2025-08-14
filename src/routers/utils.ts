const mode = import.meta.env.VITE_ROUTER_MODE;
/**
 * @description 使用递归扁平化菜单，方便添加动态路由
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 */
export function getFlatMenuList<T extends { children?: T[] }>(menuList: T[]): T[] {
  const newMenuList: T[] = JSON.parse(JSON.stringify(menuList));
  return newMenuList.flatMap(item => [item, ...(item.children ? getFlatMenuList(item.children) : [])]);
}
/**
 * @description 使用递归过滤出需要渲染在左侧菜单的列表 (需剔除 isHide == true 的菜单)
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 * */
export function getShowMenuList(menuList: Menu.MenuOptions[]) {
  const newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
  return newMenuList.filter(item => {
    item.children?.length && (item.children = getShowMenuList(item.children));
    return !item.meta?.isHide;
  });
}

/**
 * @description 使用递归找出所有面包屑存储到 pinia/vuex 中
 * @param {Array} menuList 菜单列表
 * @param {Array} parent 父级菜单
 * @param {Object} result 处理后的结果
 * @returns {Object}
 */
export const getAllBreadcrumbList = (menuList: Menu.MenuOptions[], parent = [], result: { [key: string]: any } = {}) => {
  for (const item of menuList) {
    result[item.path] = [...parent, item];
    if (item.children) getAllBreadcrumbList(item.children, result[item.path], result);
  }
  return result;
};

/**
 * @description 获取不同路由模式所对应的 url + params
 * @returns {String}
 */
export function getUrlWithParams() {
  const url = {
    hash: location.hash.substring(1),
    history: location.pathname + location.search
  };
  return url[mode];
}

export function getFirstLeafRoute(routes: Menu.MenuOptions[]): string {
  let newPath = "";
  for (let i = 0; i < routes.length; i += 1) {
    if (routes[i]?.path && routes[i]?.path !== "/" && routes[i]?.component) {
      newPath = routes[i].path;
      break;
    } else if (routes[i]?.children?.length) {
      newPath = getFirstLeafRoute(routes[i].children!);
      if (newPath) break;
    }
  }
  return newPath;
}
export function transformToMenuRoutes(
  allRoutes: Menu.MenuOptions[],
  flattenedPermissions: Login.MenuOptions[]
): Menu.MenuOptions[] {
  return allRoutes
    .filter(item => item.meta?.isRole || flattenedPermissions.find(i => i.url === item.path))
    .map(appRoute => {
      const permission = flattenedPermissions.find(item => item.url === appRoute.path);
      if (permission) {
        const { icon, sort, name } = permission;
        if (sort) appRoute.sort = sort;
        if (icon) appRoute.meta!.icon = icon;
        if (name) appRoute.meta!.title = name;
        if (appRoute?.children?.length) {
          appRoute.children = transformToMenuRoutes(appRoute.children, flattenedPermissions);
        }
        if (appRoute.redirect && appRoute?.children?.length) {
          appRoute.redirect = appRoute.children[0].path;
        }
      }
      return appRoute;
    })
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
}
