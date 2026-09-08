/**
 * type AxiosResponse<T> = T
 */

export type PostAuthInvitesAcceptBody = {
  /** @minLength 8 */
  password: string;
  /**
   * @minLength 32
   * @maxLength 128
   */
  token: string;
};
