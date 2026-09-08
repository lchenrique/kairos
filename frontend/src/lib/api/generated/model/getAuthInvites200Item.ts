/**
 * type AxiosResponse<T> = T
 */
import type { GetAuthInvites200ItemChurch } from "./getAuthInvites200ItemChurch";
import type { GetAuthInvites200ItemInvitedBy } from "./getAuthInvites200ItemInvitedBy";
import type { GetAuthInvites200ItemRole } from "./getAuthInvites200ItemRole";
import type { GetAuthInvites200ItemStatus } from "./getAuthInvites200ItemStatus";

export type GetAuthInvites200Item = {
  church: GetAuthInvites200ItemChurch;
  createdAt: string;
  email: string;
  expiresAt: string;
  id: string;
  invitedBy: GetAuthInvites200ItemInvitedBy;
  name: string;
  role: GetAuthInvites200ItemRole;
  status: GetAuthInvites200ItemStatus;
};
