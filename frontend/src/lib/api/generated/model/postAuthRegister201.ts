/**
 * type AxiosResponse<T> = T
 */
import type { PostAuthRegister201User } from "./postAuthRegister201User";

export type PostAuthRegister201 = {
  token: string;
  user: PostAuthRegister201User;
};
