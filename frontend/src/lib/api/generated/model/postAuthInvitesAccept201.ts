/**
 * type AxiosResponse<T> = T
 */
import type { PostAuthInvitesAccept201Role } from "./postAuthInvitesAccept201Role";
import type { PostAuthInvitesAccept201Status } from "./postAuthInvitesAccept201Status";

export type PostAuthInvitesAccept201 = {
  createdAt: string;
  email: string;
  id: string;
  name: string;
  role: PostAuthInvitesAccept201Role;
  status: PostAuthInvitesAccept201Status;
};
