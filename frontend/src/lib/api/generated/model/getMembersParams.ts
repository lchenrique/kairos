/**
 * type AxiosResponse<T> = T
 */
import type { GetMembersStatus } from "./getMembersStatus";
import type { GetMembersSortBy } from "./getMembersSortBy";
import type { GetMembersOrder } from "./getMembersOrder";

export type GetMembersParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: GetMembersStatus;
  sortBy?: GetMembersSortBy;
  order?: GetMembersOrder;
};
