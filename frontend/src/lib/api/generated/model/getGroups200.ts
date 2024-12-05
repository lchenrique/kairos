/**
 * type AxiosResponse<T> = T
 */
import type { GetGroups200DataItem } from "./getGroups200DataItem";
import type { GetGroups200Meta } from "./getGroups200Meta";

export type GetGroups200 = {
  data: GetGroups200DataItem[];
  meta: GetGroups200Meta;
};
