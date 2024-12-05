/**
 * type AxiosResponse<T> = T
 */
import type { PutMembersIdBodyGroupsItem } from "./putMembersIdBodyGroupsItem";
import type { PutMembersIdBodyStatus } from "./putMembersIdBodyStatus";

export type PutMembersIdBody = {
  address?: string;
  baptismDate?: string;
  birthDate?: string;
  email?: string;
  groups?: PutMembersIdBodyGroupsItem[];
  image?: string;
  name?: string;
  notes?: string;
  phone?: string;
  status?: PutMembersIdBodyStatus;
};
