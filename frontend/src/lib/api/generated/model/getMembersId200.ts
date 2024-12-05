/**
 * type AxiosResponse<T> = T
 */
import type { GetMembersId200GroupsItem } from "./getMembersId200GroupsItem";
import type { GetMembersId200Status } from "./getMembersId200Status";

export type GetMembersId200 = {
  /** @nullable */
  address: string | null;
  /** @nullable */
  baptismDate: string | null;
  /** @nullable */
  birthDate: string | null;
  createdAt: string;
  /** @nullable */
  email: string | null;
  groups: GetMembersId200GroupsItem[];
  id: string;
  /** @nullable */
  image: string | null;
  name: string;
  /** @nullable */
  notes: string | null;
  /** @nullable */
  phone: string | null;
  status: GetMembersId200Status;
  updatedAt: string;
};
