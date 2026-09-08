/**
 * type AxiosResponse<T> = T
 */
import type { PutFinanceIdBodyType } from "./putFinanceIdBodyType";

export type PutFinanceIdBody = {
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  amountCents?: number;
  /** @minLength 2 */
  category?: string;
  /** @minLength 2 */
  description?: string;
  /** @nullable */
  notes?: string | null;
  occurredAt?: string;
  /** @nullable */
  paymentMethod?: string | null;
  type?: PutFinanceIdBodyType;
};
