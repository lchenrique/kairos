/**
 * type AxiosResponse<T> = T
 */
import type { GetSystemContext200ChurchesItemStatus } from "./getSystemContext200ChurchesItemStatus";

export type GetSystemContext200ChurchesItem = {
  /** @nullable */
  address: string | null;
  id: string;
  isHeadquarters: boolean;
  name: string;
  slug: string;
  status: GetSystemContext200ChurchesItemStatus;
  /** @nullable */
  timezone: string | null;
};
