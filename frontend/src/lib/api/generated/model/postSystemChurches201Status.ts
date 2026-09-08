/**
 * type AxiosResponse<T> = T
 */

export type PostSystemChurches201Status =
  (typeof PostSystemChurches201Status)[keyof typeof PostSystemChurches201Status];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSystemChurches201Status = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;
