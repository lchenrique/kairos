/**
 * type AxiosResponse<T> = T
 */
import type { PutMembersId200GroupsItem } from "./putMembersId200GroupsItem";
import type { PutMembersId200Status } from "./putMembersId200Status";

export type PutMembersId200 = {
  /** @nullable */
  address: string | null;
  /** @nullable */
  baptismDate: string | null;
  /** @nullable */
  birthDate: string | null;
  createdAt: string;
  /** @nullable */
  email: string | null;
  groups: PutMembersId200GroupsItem[];
  id: string;
  /** @nullable */
  image: string | null;
  name: string;
  /** @nullable */
  notes: string | null;
  /** @nullable */
  phone: string | null;
  status: PutMembersId200Status;
  updatedAt: string;
};
