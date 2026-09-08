/**
 * type AxiosResponse<T> = T
 */

export type PostAuthPasswordResetBody = {
  /** @minLength 8 */
  password: string;
  /**
   * @minLength 32
   * @maxLength 128
   */
  token: string;
};
