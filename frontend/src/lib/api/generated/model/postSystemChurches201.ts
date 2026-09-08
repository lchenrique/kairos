/**
 * type AxiosResponse<T> = T
 */
import type { PostSystemChurches201Status } from "./postSystemChurches201Status";

export type PostSystemChurches201 = {
  /** @nullable */
  address: string | null;
  id: string;
  isHeadquarters: boolean;
  name: string;
  slug: string;
  status: PostSystemChurches201Status;
  /** @nullable */
  timezone: string | null;
};
