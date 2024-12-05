/**
 * type AxiosResponse<T> = T
 */

export type PostAuthRegisterBody = {
  email: string;
  /** @minLength 3 */
  name: string;
  /** @minLength 6 */
  password: string;
};
