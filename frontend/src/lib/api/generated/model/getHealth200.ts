/**
 * type AxiosResponse<T> = T
 */
import type { GetHealth200Database } from "./getHealth200Database";
import type { GetHealth200Status } from "./getHealth200Status";

export type GetHealth200 = {
  database: GetHealth200Database;
  status: GetHealth200Status;
  timestamp: string;
  uptimeSeconds: number;
};
