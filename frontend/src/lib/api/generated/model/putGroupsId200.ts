/**
 * type AxiosResponse<T> = T
 */
import type { PutGroupsId200MembersItem } from "./putGroupsId200MembersItem";
import type { PutGroupsId200Type } from "./putGroupsId200Type";

export type PutGroupsId200 = {
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
  members: PutGroupsId200MembersItem[];
  name: string;
  /** @nullable */
  startTime: string | null;
  type: PutGroupsId200Type;
  updatedAt: string;
};
