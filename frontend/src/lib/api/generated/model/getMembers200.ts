/**
 * type AxiosResponse<T> = T
 */
import type { GetMembers200DataItem } from "./getMembers200DataItem";
import type { GetMembers200Meta } from "./getMembers200Meta";

export type GetMembers200 = {
  data: GetMembers200DataItem[];
  meta: GetMembers200Meta;
};
