declare namespace Login {
  interface MenuOptions {
    /*** 子节点列表 */
    children?: MenuOptions[];
    /*** 创建时间 */
    createDate: string;
    /** * 菜单图标 */
    icon?: string;
    /*** 主键 */
    id: number;
    /*** 菜单名称*/
    name: string;
    /** * 上级ID */
    pid?: number;
    /** * 排序  */
    sort?: number;
    /** * 菜单URL */
    url: string;
  }

  // 按钮权限
  interface ResAuthButtons {
    [key: string]: string[];
  }
}
