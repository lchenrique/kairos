/**
 * type AxiosResponse<T> = T
 */
import type { GetGroups200DataItemMembersItem } from "./getGroups200DataItemMembersItem";
import type { GetGroups200DataItemType } from "./getGroups200DataItemType";

export type GetGroups200DataItem = {
  createdAt: string;
  /** @nullable */
  description: string | null;
  /** @nullable */
  endTime: string | null;
  id: string;
  /** @nullable */
  location: string | null;
  /** @nullable */
  meetingDay: string | null;
  members: GetGroups200DataItemMembersItem[];
  name: string;
  /** @nullable */
  startTime: string | null;
  type: GetGroups200DataItemType;
  updatedAt: string;
};
