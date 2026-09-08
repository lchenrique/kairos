/**
 * type AxiosResponse<T> = T
 */
import type { GetFinanceType } from "./getFinanceType";

export type GetFinanceParams = {
  type?: GetFinanceType;
  category?: string;
  from?: string;
  to?: string;
  limit?: number;
};
