/**
 * type AxiosResponse<T> = T
 */
import type { PostAuthInvitesBodyRole } from "./postAuthInvitesBodyRole";

export type PostAuthInvitesBody = {
  email: string;
  /**
   * @minLength 3
   * @maxLength 120
   */
  name: string;
  role?: PostAuthInvitesBodyRole;
};
