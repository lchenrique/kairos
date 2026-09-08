/**
 * type AxiosResponse<T> = T
 */
import type { GetMembersIdParticipation200ItemStatus } from "./getMembersIdParticipation200ItemStatus";

export type GetMembersIdParticipation200Item = {
  changes: number;
  /** @nullable */
  endDate: string | null;
  eventId: string;
  /** @nullable */
  lastUpdatedAt: string | null;
  startDate: string;
  status: GetMembersIdParticipation200ItemStatus;
  title: string;
};
