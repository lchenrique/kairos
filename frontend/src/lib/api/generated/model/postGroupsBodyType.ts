/**
 * type AxiosResponse<T> = T
 */

export type PostGroupsBodyType =
  (typeof PostGroupsBodyType)[keyof typeof PostGroupsBodyType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostGroupsBodyType = {
  CELL: "CELL",
  MINISTRY: "MINISTRY",
  DEPARTMENT: "DEPARTMENT",
  OTHER: "OTHER",
} as const;
