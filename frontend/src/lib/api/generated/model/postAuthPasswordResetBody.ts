/**
 * type AxiosResponse<T> = T
 */

export type PostAuthPasswordResetBody = {
  /** @minLength 6 */
  password: string;
  token: string;
};
