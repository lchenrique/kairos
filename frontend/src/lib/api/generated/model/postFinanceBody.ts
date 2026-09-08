/**
 * type AxiosResponse<T> = T
 */
import type { PostFinanceBodyType } from "./postFinanceBodyType";

export type PostFinanceBody = {
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  amountCents: number;
  /** @minLength 2 */
  category: string;
  /** @minLength 2 */
  description: string;
  /** @nullable */
  notes?: string | null;
  occurredAt: string;
  /** @nullable */
  paymentMethod?: string | null;
  type: PostFinanceBodyType;
};
