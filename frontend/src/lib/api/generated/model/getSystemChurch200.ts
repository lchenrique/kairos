/**
 * type AxiosResponse<T> = T
 */
import type { GetSystemChurch200Theme } from "./getSystemChurch200Theme";

export type GetSystemChurch200 = {
  address?: string;
  dateFormat?: string;
  email?: string;
  logo?: string;
  /** @minLength 3 */
  name: string;
  phone?: string;
  theme?: GetSystemChurch200Theme;
  timeFormat?: string;
  timezone?: string;
};
