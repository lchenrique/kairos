/**
 * type AxiosResponse<T> = T
 */
import type { PostAuthLogin200UserRole } from "./postAuthLogin200UserRole";

export type PostAuthLogin200User = {
  createdAt: string;
  email: string;
  id: string;
  name: string;
  role: PostAuthLogin200UserRole;
  updatedAt: string;
};
