/**
 * type AxiosResponse<T> = T
 */
import type { PatchAuthUsersIdStatus200Role } from "./patchAuthUsersIdStatus200Role";
import type { PatchAuthUsersIdStatus200Status } from "./patchAuthUsersIdStatus200Status";

export type PatchAuthUsersIdStatus200 = {
  createdAt: string;
  email: string;
  id: string;
  name: string;
  role: PatchAuthUsersIdStatus200Role;
  status: PatchAuthUsersIdStatus200Status;
};
