/**
 * type AxiosResponse<T> = T
 */

export type PostGroups201Type =
  (typeof PostGroups201Type)[keyof typeof PostGroups201Type];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostGroups201Type = {
  CELL: "CELL",
  MINISTRY: "MINISTRY",
  DEPARTMENT: "DEPARTMENT",
  OTHER: "OTHER",
} as const;
