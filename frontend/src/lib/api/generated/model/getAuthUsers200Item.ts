/**
 * type AxiosResponse<T> = T
 */
import type { GetAuthUsers200ItemRole } from "./getAuthUsers200ItemRole";
import type { GetAuthUsers200ItemStatus } from "./getAuthUsers200ItemStatus";

export type GetAuthUsers200Item = {
  createdAt: string;
  email: string;
  id: string;
  name: string;
  role: GetAuthUsers200ItemRole;
  status: GetAuthUsers200ItemStatus;
};
