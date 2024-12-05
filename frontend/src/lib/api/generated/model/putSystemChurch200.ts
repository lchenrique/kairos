/**
 * type AxiosResponse<T> = T
 */
import type { PutSystemChurch200Theme } from "./putSystemChurch200Theme";

export type PutSystemChurch200 = {
  address?: string;
  dateFormat?: string;
  email?: string;
  logo?: string;
  /** @minLength 3 */
  name: string;
  phone?: string;
  theme?: PutSystemChurch200Theme;
  timeFormat?: string;
  timezone?: string;
};
