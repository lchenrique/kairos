/**
 * type AxiosResponse<T> = T
 */

export type GetGroupsType = (typeof GetGroupsType)[keyof typeof GetGroupsType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetGroupsType = {
  CELL: "CELL",
  MINISTRY: "MINISTRY",
  DEPARTMENT: "DEPARTMENT",
  OTHER: "OTHER",
} as const;
