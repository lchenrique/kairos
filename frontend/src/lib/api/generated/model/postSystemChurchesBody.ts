/**
 * type AxiosResponse<T> = T
 */

export type PostSystemChurchesBody = {
  /** @maxLength 240 */
  address?: string;
  email?: string;
  /**
   * @minLength 3
   * @maxLength 120
   */
  name: string;
  /** @maxLength 30 */
  phone?: string;
  /**
   * @minLength 2
   * @maxLength 80
   */
  slug?: string;
  /** @minLength 3 */
  timezone?: string;
};
