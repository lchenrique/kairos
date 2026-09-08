/**
 * type AxiosResponse<T> = T
 */
import type { GetReportsOverview200Attendance } from "./getReportsOverview200Attendance";
import type { GetReportsOverview200Period } from "./getReportsOverview200Period";

export type GetReportsOverview200 = {
  activeMembers: number;
  attendance: GetReportsOverview200Attendance;
  eventsTotal: number;
  generatedAt: string;
  groupsTotal: number;
  membersTotal: number;
  period: GetReportsOverview200Period;
  upcomingEvents: number;
};
