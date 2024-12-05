/**
 * type AxiosResponse<T> = T
 */

export type GetMembersOrder =
  (typeof GetMembersOrder)[keyof typeof GetMembersOrder];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMembersOrder = {
  asc: "asc",
  desc: "desc",
} as const;
