/**
 * type AxiosResponse<T> = T
 */
import type { GetGroupsType } from "./getGroupsType";
import type { GetGroupsSortBy } from "./getGroupsSortBy";
import type { GetGroupsOrder } from "./getGroupsOrder";

export type GetGroupsParams = {
  page?: number;
  limit?: number;
  search?: string;
  type?: GetGroupsType;
  sortBy?: GetGroupsSortBy;
  order?: GetGroupsOrder;
};
