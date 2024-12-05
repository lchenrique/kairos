/**
 * type AxiosResponse<T> = T
 */
import type { PostGroupsBodyMembersItem } from "./postGroupsBodyMembersItem";
import type { PostGroupsBodyType } from "./postGroupsBodyType";

export type PostGroupsBody = {
  description?: string;
  /** @pattern ^([0-1][0-9]|2[0-3]):[0-5][0-9]$ */
  endTime?: string;
  location?: string;
  meetingDay?: string;
  members?: PostGroupsBodyMembersItem[];
  /** @minLength 3 */
  name: string;
  /** @pattern ^([0-1][0-9]|2[0-3]):[0-5][0-9]$ */
  startTime?: string;
  type: PostGroupsBodyType;
};
