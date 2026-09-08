/**
 * type AxiosResponse<T> = T
 */
import type { GetAuthProfile200Role } from "./getAuthProfile200Role";

export type GetAuthProfile200 = {
  createdAt: string;
  email: string;
  id: string;
  name: string;
  role: GetAuthProfile200Role;
  updatedAt: string;
};
