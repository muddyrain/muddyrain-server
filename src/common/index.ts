/**
 * 分页查询参数类型
 */
export interface PagerQueryParams {
  page: number;
  pageSize: number;
}

/**
 * 动态路由参数类型
 */
export type ParamsType = Record<string, string>;
