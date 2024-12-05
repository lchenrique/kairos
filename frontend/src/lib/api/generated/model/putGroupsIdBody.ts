/**
 * type AxiosResponse<T> = T
 */
import type { PutGroupsIdBodyMembersItem } from "./putGroupsIdBodyMembersItem";
import type { PutGroupsIdBodyType } from "./putGroupsIdBodyType";

export type PutGroupsIdBody = {
  description?: string;
  /** @pattern ^([0-1][0-9]|2[0-3]):[0-5][0-9]$ */
  endTime?: string;
  location?: string;
  meetingDay?: string;
  members?: PutGroupsIdBodyMembersItem[];
  /** @minLength 3 */
  name?: string;
  /** @pattern ^([0-1][0-9]|2[0-3]):[0-5][0-9]$ */
  startTime?: string;
  type?: PutGroupsIdBodyType;
};
