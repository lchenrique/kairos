/**
 * type AxiosResponse<T> = T
 */
import type { GetSystemContext200ChurchesItem } from "./getSystemContext200ChurchesItem";
import type { GetSystemContext200Organization } from "./getSystemContext200Organization";

export type GetSystemContext200 = {
  allChurches: boolean;
  churches: GetSystemContext200ChurchesItem[];
  organization: GetSystemContext200Organization;
  /** @nullable */
  selectedChurchId: string | null;
};
