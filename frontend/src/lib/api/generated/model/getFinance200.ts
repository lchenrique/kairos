/**
 * type AxiosResponse<T> = T
 */
import type { GetFinance200DataItem } from "./getFinance200DataItem";
import type { GetFinance200Summary } from "./getFinance200Summary";

export type GetFinance200 = {
  categories: string[];
  data: GetFinance200DataItem[];
  summary: GetFinance200Summary;
};
