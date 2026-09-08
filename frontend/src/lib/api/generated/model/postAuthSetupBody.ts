/**
 * type AxiosResponse<T> = T
 */

export type PostAuthSetupBody = {
  /** @maxLength 240 */
  address?: string;
  /**
   * @minLength 3
   * @maxLength 120
   */
  adminName: string;
  /**
   * @minLength 3
   * @maxLength 120
   */
  churchName: string;
  email: string;
  /**
   * @minLength 3
   * @maxLength 120
   */
  organizationName: string;
  /** @minLength 8 */
  password: string;
  /** @maxLength 30 */
  phone?: string;
  /** @minLength 3 */
  timezone?: string;
};
