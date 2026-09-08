/**
 * type AxiosResponse<T> = T
 */
import type { GetFinance200DataItemType } from "./getFinance200DataItemType";

export type GetFinance200DataItem = {
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
  type: GetFinance200DataItemType;
  updatedAt: string;
  /** @nullable */
  updatedById: string | null;
  /** @nullable */
  updatedByName: string | null;
};
