/**
 * type AxiosResponse<T> = T
 */
import type { PutSystemChurchBodyTheme } from "./putSystemChurchBodyTheme";

export type PutSystemChurchBody = {
  address?: string;
  dateFormat?: string;
  email?: string;
  logo?: string;
  /** @minLength 3 */
  name?: string;
  phone?: string;
  theme?: PutSystemChurchBodyTheme;
  timeFormat?: string;
  timezone?: string;
};
