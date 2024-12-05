/**
 * type AxiosResponse<T> = T
 */
import type { GetGroupsId200MembersItem } from "./getGroupsId200MembersItem";
import type { GetGroupsId200Type } from "./getGroupsId200Type";

export type GetGroupsId200 = {
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
  members: GetGroupsId200MembersItem[];
  name: string;
  /** @nullable */
  startTime: string | null;
  type: GetGroupsId200Type;
  updatedAt: string;
};
