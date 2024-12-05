/**
 * type AxiosResponse<T> = T
 */
import type { GetMembers200DataItemGroupsItem } from "./getMembers200DataItemGroupsItem";
import type { GetMembers200DataItemStatus } from "./getMembers200DataItemStatus";

export type GetMembers200DataItem = {
  /** @nullable */
  address: string | null;
  /** @nullable */
  baptismDate: string | null;
  /** @nullable */
  birthDate: string | null;
  createdAt: string;
  /** @nullable */
  email: string | null;
  groups: GetMembers200DataItemGroupsItem[];
  id: string;
  /** @nullable */
  image: string | null;
  name: string;
  /** @nullable */
  notes: string | null;
  /** @nullable */
  phone: string | null;
  status: GetMembers200DataItemStatus;
  updatedAt: string;
};
