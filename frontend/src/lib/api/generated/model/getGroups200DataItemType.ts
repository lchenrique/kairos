/**
 * type AxiosResponse<T> = T
 */

export type GetGroups200DataItemType =
  (typeof GetGroups200DataItemType)[keyof typeof GetGroups200DataItemType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetGroups200DataItemType = {
  CELL: "CELL",
  MINISTRY: "MINISTRY",
  DEPARTMENT: "DEPARTMENT",
  OTHER: "OTHER",
} as const;
