/**
 * type AxiosResponse<T> = T
 */
import type { PostAuthInvites201Church } from "./postAuthInvites201Church";
import type { PostAuthInvites201InvitedBy } from "./postAuthInvites201InvitedBy";
import type { PostAuthInvites201Role } from "./postAuthInvites201Role";
import type { PostAuthInvites201Status } from "./postAuthInvites201Status";

export type PostAuthInvites201 = {
  church: PostAuthInvites201Church;
  createdAt: string;
  email: string;
  expiresAt: string;
  id: string;
  invitedBy: PostAuthInvites201InvitedBy;
  name: string;
  role: PostAuthInvites201Role;
  status: PostAuthInvites201Status;
};
