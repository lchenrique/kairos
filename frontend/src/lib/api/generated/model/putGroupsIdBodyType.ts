/**
 * type AxiosResponse<T> = T
 */

export type PutGroupsIdBodyType =
  (typeof PutGroupsIdBodyType)[keyof typeof PutGroupsIdBodyType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutGroupsIdBodyType = {
  CELL: "CELL",
  MINISTRY: "MINISTRY",
  DEPARTMENT: "DEPARTMENT",
  OTHER: "OTHER",
} as const;
