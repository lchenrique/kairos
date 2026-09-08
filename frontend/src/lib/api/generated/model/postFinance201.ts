/**
 * type AxiosResponse<T> = T
 */
import type { PostFinance201Type } from "./postFinance201Type";

export type PostFinance201 = {
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  amountCents: number;
  category: string;
  createdAt: string;
  /** @nullable */
  createdById: string | null;
  /** @nullable */
  createdByName: string | null;
  description: string;
  id: string;
  /** @nullable */
  notes: string | null;
  occurredAt: string;
  /** @nullable */
  paymentMethod: string | null;
  type: PostFinance201Type;
  updatedAt: string;
  /** @nullable */
  updatedById: string | null;
  /** @nullable */
  updatedByName: string | null;
};
