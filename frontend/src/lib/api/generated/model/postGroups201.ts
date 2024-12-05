/**
 * type AxiosResponse<T> = T
 */
import type { PostGroups201MembersItem } from "./postGroups201MembersItem";
import type { PostGroups201Type } from "./postGroups201Type";

export type PostGroups201 = {
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
  members: PostGroups201MembersItem[];
  name: string;
  /** @nullable */
  startTime: string | null;
  type: PostGroups201Type;
  updatedAt: string;
};
