/**
 * type AxiosResponse<T> = T
 */
import type { PostMembersBodyGroupsItem } from "./postMembersBodyGroupsItem";
import type { PostMembersBodyStatus } from "./postMembersBodyStatus";

export type PostMembersBody = {
  address?: string;
  baptismDate?: string;
  birthDate?: string;
  email?: string;
  groups?: PostMembersBodyGroupsItem[];
  image?: string;
  name: string;
  notes?: string;
  phone?: string;
  status?: PostMembersBodyStatus;
};
