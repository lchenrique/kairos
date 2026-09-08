/**
 * type AxiosResponse<T> = T
 */
import type { GetHealth503Database } from "./getHealth503Database";
import type { GetHealth503Status } from "./getHealth503Status";

export type GetHealth503 = {
  database: GetHealth503Database;
  status: GetHealth503Status;
  timestamp: string;
};
