/**
 * type AxiosResponse<T> = T
 */
import type { PostAuthLogin200User } from "./postAuthLogin200User";

export type PostAuthLogin200 = {
  token: string;
  user: PostAuthLogin200User;
};
