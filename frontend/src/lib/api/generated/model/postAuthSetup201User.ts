/**
 * type AxiosResponse<T> = T
 */
import type { PostAuthSetup201UserRole } from "./postAuthSetup201UserRole";

export type PostAuthSetup201User = {
  createdAt: string;
  email: string;
  id: string;
  name: string;
  role: PostAuthSetup201UserRole;
  updatedAt: string;
};
