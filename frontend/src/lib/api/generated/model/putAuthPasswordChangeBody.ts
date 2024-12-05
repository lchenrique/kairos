/**
 * type AxiosResponse<T> = T
 */

export type PutAuthPasswordChangeBody = {
  /** @minLength 6 */
  currentPassword: string;
  /** @minLength 6 */
  newPassword: string;
};
