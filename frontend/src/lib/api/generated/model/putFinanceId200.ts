/**
 * type AxiosResponse<T> = T
 */
import type { PutFinanceId200Type } from "./putFinanceId200Type";

export type PutFinanceId200 = {
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
  type: PutFinanceId200Type;
  updatedAt: string;
  /** @nullable */
  updatedById: string | null;
  /** @nullable */
  updatedByName: string | null;
};
