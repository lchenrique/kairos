/**
 * type AxiosResponse<T> = T
 */

export type PostAuthLoginBody = {
  email: string;
  /** @minLength 1 */
  password: string;
};
