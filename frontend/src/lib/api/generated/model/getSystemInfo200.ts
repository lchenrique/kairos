/**
 * type AxiosResponse<T> = T
 */
import type { GetSystemInfo200Cpu } from "./getSystemInfo200Cpu";
import type { GetSystemInfo200Memory } from "./getSystemInfo200Memory";
import type { GetSystemInfo200Os } from "./getSystemInfo200Os";

export type GetSystemInfo200 = {
  cpu: GetSystemInfo200Cpu;
  memory: GetSystemInfo200Memory;
  os: GetSystemInfo200Os;
  uptime: number;
  version: string;
};
