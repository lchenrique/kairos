/**
 * type AxiosResponse<T> = T
 */
import type { PatchAuthUsersIdRole200Role } from "./patchAuthUsersIdRole200Role";
import type { PatchAuthUsersIdRole200Status } from "./patchAuthUsersIdRole200Status";

export type PatchAuthUsersIdRole200 = {
  createdAt: string;
  email: string;
  id: string;
  name: string;
  role: PatchAuthUsersIdRole200Role;
  status: PatchAuthUsersIdRole200Status;
};
