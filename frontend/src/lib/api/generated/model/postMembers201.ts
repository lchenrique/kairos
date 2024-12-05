/**
 * type AxiosResponse<T> = T
 */
import type { PostMembers201GroupsItem } from "./postMembers201GroupsItem";
import type { PostMembers201Status } from "./postMembers201Status";

export type PostMembers201 = {
  /** @nullable */
  address: string | null;
  /** @nullable */
  baptismDate: string | null;
  /** @nullable */
  birthDate: string | null;
  createdAt: string;
  /** @nullable */
  email: string | null;
  groups: PostMembers201GroupsItem[];
  id: string;
  /** @nullable */
  image: string | null;
  name: string;
  /** @nullable */
  notes: string | null;
  /** @nullable */
  phone: string | null;
  status: PostMembers201Status;
  updatedAt: string;
};
